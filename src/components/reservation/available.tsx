/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Info } from 'react-feather';
import { getFireCollection, getFireMultiCollection } from '../../data/fire';
import { generateDateString, getSimpleDateString, shortDay } from '../../helper/date';
import getQuestFormValue from '../../helper/priceStructure';
import useForm from '../../hooks/useForm';
import { ServiceField, ServiceInfo } from '../../interfaces/company';
import { FormInit } from '../../interfaces/form';
import { CapacityList, Reserved, Available } from '../../interfaces/reservation';
import BasicInput from '../form/basicInput';
import Counter from '../form/counter';
import SelectInput from '../form/selectInput';
import Item from '../item';
import TopButton from '../topButton';
import Confirm from './confirm';
import Slots from './slots/slots';

interface ReserveAvailableProps {
    service: ServiceInfo;
    openings: (string | false)[];
    activityID: string;
    modalState?: 'info' | 'available' | 'confirm' | 'finished';
    changeState: (type: 'info' | 'available' | 'confirm' | 'finished' | undefined) => void;
}

const ReserveAvailable: FunctionalComponent<ReserveAvailableProps> = ({ service, activityID, modalState, openings, changeState }: ReserveAvailableProps) => {
  const [activityData, setActivityData] = useState<{
        structure?: ServiceField[];
        available?: Available;
        personList?: string[];
        loaded: boolean;
      }>({
        loaded: false,
      });

  const [reserved, setReserved] = useState<Reserved[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [durationList, setDurationList] = useState<{ list: any; isRound: boolean }>();
  const [capacityList, setCapacityList] = useState<CapacityList[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [foundation, setFoundation] = useState<'person' | 'object'>('person');
  const [rooms, setRooms] = useState<number>(1);

  const [reservationTime, setReservationTime] = useState<string>();

  const formInit: FormInit = {
    calendar: { value: getSimpleDateString(new Date()), type: 'string', required: false },
    personAmount: { value: 1, type: 'number', required: false },
    duration: { type: 'number', required: false },
    personAges: { value: 'number', type: 'string[]', required: false },
  };

  const { fields, changeField } = useForm(formInit);

  const chooseTime = (time: string) => {
    if (duration) {
      setReservationTime(time);
      changeState('confirm');
    }
  };

  /**
     * Wir holen uns die richtigen Dauern.
     * Wenn es Runden sind, werden sie mal die angegebene Dauer gerechnet.
     * Wenn Min. oder Runden Tagesabhängig sind, überprüfen wir sie mit dem gewähltem Tag.
     * !!Tageskarten neu unterbringen.
     */
  const setUpDuration = (dateIndex: number) => {
    const { list = [], isRound = false } = getQuestFormValue(shortDay[dateIndex], activityData.structure?.find((x) => x.name === 'duration')?.answers);
    if (list.length >= 1) setDuration(isRound ? '1' : list[0]);
    setDurationList({ list, isRound });
  };

  /**
       * Berechnet die Raum Anzahl
       */
  const calculateRooms = (from: number, maxPersons: number) => Math.ceil(from / maxPersons);

  //   const displayPersFunction = (item: string) => {
  //     if (activityData.available?.countMaxRoomPerson) {
  //       return `${parseInt(item, 10)} Pers. (Anz. Räume: ${calculateRooms(parseInt(item, 10), activityData.available.countMaxRoomPerson)})`;
  //     }
  //     return item;
  //   };

  //   const displayRoundFunction = (item: string) => {
  //     if (durationList?.isRound) {
  //       return `${item} Runde (ca. ${parseInt(item, 10) * durationList.list[0]} Min.)`;
  //     }
  //     return item;
  //   };

  // const generatePersons = (countMaxPerson: number, countMinPerson: number) => {
  //   const maxPlaces = 30;

  //   const checkIfPersonValid = (personCount: number) => {
  //     const roomCount = calculateRooms(personCount, countMaxPerson);
  //     const roomCountMinPerson = personCount / roomCount;
  //     return countMinPerson <= roomCountMinPerson;
  //   };

  //   // const calculate: string[] = Array.from({ length: maxPlaces }, (v, i: any) => i + 1).filter((x: string) => checkIfPersonValid(parseInt(x, 10)));
  //   // setPersonList(calculate);
  // };

  /**
       * Wenn der Tag geändert wird.
       * Aktualisieren die Durations (falls sie Tagesabhängig sind)
       * und wir gucken ob geöffnet ist und laden, wenn geöffnet ist die schon revervierten Daten
       */
  const loadReservationData = () => {
    const choosenDate: Date = new Date(fields.calendar);
    const dateIndex: number = choosenDate.getDay();
    const dateID = generateDateString(choosenDate);

    // const today = new Date();

    // const dateIsToday = choosenDate > today || dayString(choosenDate) === dayString(today);

    const checkIfOpen: boolean = !!openings?.[dateIndex];
    setIsOpen(checkIfOpen);
    // console.log({ checkIfOpen, today: !!openings?.[dateIndex], dateIsToday });

    if (checkIfOpen && choosenDate) {
      getFireCollection(`activities/${activityID}/services/${service.id}/reserved`, false, [['date', '==', dateID]]).then((data) => data && setReserved(data));
      getFireCollection(`activities/${activityID}/available/${service.id}/capacity`, false, [['date', '==', dateID]]).then((data) => setCapacityList(data));
      setUpDuration(dateIndex);
    }
  };

  useEffect(() => {
    if (activityData.structure) {
      loadReservationData();
      // priceStructure.find((x: QuestionDB) => x.name === 'foundation')
    }
  }, [activityData.structure, fields.calendar]);

  useEffect(() => {
    if (fields.personAmount && activityData.available?.countMaxRoomPerson) {
      const getRooms = calculateRooms(fields.personAmount, activityData.available.countMaxRoomPerson);
      console.log(getRooms);
      setRooms(getRooms);
    }
  }, [fields.personAmount]);

  useEffect(() => {
    if (service) {
      getFireMultiCollection([
        { path: `activities/${activityID}/structures/${service.structureID}/fields` },
        { path: `activities/${activityID}/available/${service.id}`, isDocument: true },
      ]).then(([structure, available]: [ServiceField[], Available]) => {
        if (structure) {
          // generatePersons(available.countMaxRoomPerson, available.countMinPerson);
          const choosenDate: Date = new Date(fields.calendar);
          const dateIndex: number = choosenDate.getDay();
          const getFoundation: 'person' | 'object' = (getQuestFormValue(shortDay[dateIndex], structure?.find((x) => x.name === 'foundation')?.answers)?.list?.[0] || 'person') as ('person' | 'object');
          setFoundation(getFoundation);
          changeField(available.countMinPerson, 'personAmount');
          setActivityData({
            loaded: true,
            structure,
            available,
          });
        }
      });
    }
  }, [service]);

  if (modalState === 'confirm' && reservationTime && service && duration && durationList) return <Confirm foundation={foundation} changeState={changeState} service={service} activityID={activityID} serviceName={service.serviceName || 'nicht angegeben'} date={fields.calendar} personAmount={fields.personAmount} amountRooms={rooms} durationList={durationList} duration={duration} reservationTime={reservationTime} />;

  return (
    <Fragment>
      <TopButton action={() => changeState('info')} />

      {/* {service && confirmOpen && reservationTime && duration && durationList && <ConfirmReservation foundation="persPrice" changeState={changeState} service={service} title={service.serviceName?.[0] || 'nicht angegeben'} date={fields.calendar[0]} personAmount={fields.personAmount} amountRooms={rooms} durationList={durationList} duration={duration} reservationTime={reservationTime} />} */}

      <BasicInput
        label="Wähle einen Tag"
        name="calendar"
        icon={<Calendar />}
        change={changeField}
        value={fields.calendar}
        error={isOpen ? 'valid' : 'invalid'}
        type="date"
      />

      <Counter
        label={`Wie viele Personen? (max.: ${activityData.available?.countMaxRoomPerson || 1} Pers.)`}
        name="personAmount"
        value={+fields.personAmount}
        min={1}
        max={activityData.available?.countMaxRoomPerson || 1}
        change={changeField}
      />

      {durationList?.isRound ? (
        <Counter label="Für wie viele Runden?" name="duration" value={+duration} change={changeField} max={10} min={1} />
      ) : (durationList?.list[1]) && (
        <SelectInput
          label="Für welche Dauer?"
          name="duration"
          value={duration}
          options={durationList?.list}
          change={setDuration}
        />
      )}

      {isOpen && duration && durationList?.list.length === 1 && (
        <Item type="grey" icon={<Info />} label={`Die ${durationList.isRound ? 'Rundendauer' : 'Standartdauer'} beträgt ${durationList.isRound ? durationList.list[0] : duration} Min. ${durationList.isRound && duration !== '1' ? `(${durationList.list[0] * parseInt(duration, 10)} Min.` : ''}`} text="Die Dauer ist die vom Unternehmen eingestellte Standartdauer." />
      )}
      {activityData.loaded && !activityData.available && <p class="orange">Die Unternehmung wurde noch nicht komplett eingerichtet</p>}

      {isOpen && activityData.available && service?.serviceType && duration && durationList ? (
        <Slots
          duration={parseInt(duration, 10)}
          durationList={durationList}
          amountRooms={rooms}
          chooseTime={chooseTime}
          serviceType={service.serviceType}
          personAmount={fields.personAmount}
          available={activityData.available}
          openings={openings}
          reserved={reserved}
          capacityList={capacityList}
        />
      ) : (
        isOpen ? (<p class="red">Bitte wähle alle optionen</p>) : (
          <Item type="grey" icon={<Info />} label={`Nicht verfügbar (${fields.calendar})`} text="Bitte wähle einen geöffneten Tag aus" />
        )
      )}
    </Fragment>
  );
};

export default ReserveAvailable;
