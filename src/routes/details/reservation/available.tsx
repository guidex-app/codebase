/* eslint-disable no-nested-ternary */
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Calendar, Info, UserPlus } from 'react-feather';

import Chip from '../../../components/chip';
import BasicInput from '../../../components/form/basicInput';
import Counter from '../../../components/form/counter';
import SelectInput from '../../../components/form/selectInput';
import Item from '../../../components/item';
import TopButton from '../../../components/topButton';
import { getFireMultiCollection } from '../../../data/fire';
import { generateDateString, getSimpleDateString, shortDay } from '../../../helper/date';
import getQuestFormValue from '../../../helper/priceStructure';
import useForm from '../../../hooks/useForm';
import { ServiceField, ServiceInfo } from '../../../interfaces/company';
import { FormInit } from '../../../interfaces/form';
import { Available, Capacity, Reserved } from '../../../interfaces/reservation';
import Confirm from './confirm';
import EditPersons from './editPersons';
import Slots from './slots/slots';

interface ReserveAvailableProps {
    service: ServiceInfo;
    openings: (string | false)[];
    activityID: string;
    modalState?: 'info' | 'available' | 'confirm' | 'finished';
    changeState: (type: 'info' | 'available' | 'confirm' | 'finished' | undefined) => void;
}

const ReserveAvailable: FunctionalComponent<ReserveAvailableProps> = ({ service, activityID, modalState, openings, changeState }: ReserveAvailableProps) => {
  const [durationList, setDurationList] = useState<{ list: any; isRound: boolean }>();
  const [duration, setDuration] = useState<string>('');
  const [foundation, setFoundation] = useState<'person' | 'object'>('person');
  const [rooms, setRooms] = useState<number>(1);

  const formInit: FormInit = {
    selectedDay: { type: 'string', required: false }, // aktueller Tag
    selectedShortDay: { type: 'string', required: false },
    personAmount: { type: 'number', required: false }, // anzahl der Personen
    duration: { type: 'number', required: false }, // ausgewählte dauer
    personAges: { type: 'string[]', required: false }, // alters rabatt
    reservationTime: { type: 'string', required: false }, // aktuelle slot auswahl
  };

  const { fields, changeField } = useForm(formInit);

  const [reservationData, setReservationData] = useState<{
    structure?: ServiceField[]; // Preisstrukture
    available?: Available; // Verfügbarkeitsinfos
    capacities?: Capacity[]; // Verfügbarkeiten der Uhrzeiten
    reservations?: Reserved[]; // Reservierungen
    personList?: string[]; // Personenlisten
    isOpen?: boolean;
    loaded: boolean; // geladen
  }>({
    isOpen: false,
    loaded: false,
  });

  const chooseTime = (time: string) => {
    if (duration) {
      changeField(time, 'reservationTime');
      changeState('confirm');
    }
  };

  const chooseDay = (newDay: string) => {
    changeField(newDay, 'selectedDay');
    changeField(shortDay[new Date(newDay).getDay()], 'selectedShortDay');
  };

  /**
   * Wir holen uns die richtigen Dauern.
   * Wenn es Runden sind, werden sie mal die angegebene Dauer gerechnet.
   * Wenn Min. oder Runden Tagesabhängig sind, überprüfen wir sie mit dem gewähltem Tag.
   * !!Tageskarten neu unterbringen.
   */
  const setUpDuration = () => {
    const { list = [], isRound = false } = getQuestFormValue(fields.selectedShortDay, reservationData.structure?.find((x) => x.name === 'duration')?.answers);
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
  const loadDayData = () => {
    if (reservationData.structure) {
      const currentDay: Date = new Date(fields.selectedDay);
      const isOpen: boolean = !!openings?.[currentDay.getDay()];
      if (isOpen) {
        const currentDayID = generateDateString(currentDay);
        console.log(currentDayID);
        getFireMultiCollection([
          { path: `activities/${activityID}/services/${service.id}/reserved`, where: [['date', '==', currentDayID]] },
          { path: `activities/${activityID}/available/${service.id}/capacity`, where: [['date', '==', currentDayID]] },
        ]).then(([reservations, capacities]: [Reserved[], Capacity[]]) => {
          setUpDuration();
          setReservationData({
            ...reservationData,
            reservations,
            capacities,
            isOpen,
          });
        });
      }
    }
  };

  const loadReservationData = () => {
    if (fields.selectedDay) {
      getFireMultiCollection([
        { path: `activities/${activityID}/structures/${service.structureID}/fields` },
        { path: `activities/${activityID}/available/${service.id}`, isDocument: true },
      ]).then(([structure, available]: [ServiceField[], Available]) => {
        if (structure && available) {
          // generatePersons(available.countMaxRoomPerson, available.countMinPerson);
          const getFoundation: 'person' | 'object' = (getQuestFormValue(fields.selectedShortDay, structure?.find((x) => x.name === 'foundation')?.answers)?.list?.[0] || 'person') as ('person' | 'object');
          setFoundation(getFoundation);
          changeField(available.countMinPerson, 'personAmount');
          setReservationData({ loaded: true, structure, available });
        }
      });
    }
  };

  useEffect(() => {
    if (fields.personAmount && reservationData.available?.countMaxRoomPerson) {
      setRooms(calculateRooms(fields.personAmount, reservationData.available.countMaxRoomPerson));
    }
  }, [fields.personAmount]);

  useEffect(() => { loadDayData(); }, [reservationData.structure]);
  useEffect(() => { loadReservationData(); }, [fields.selectedDay]); // init einer leistung
  useEffect(() => { chooseDay(getSimpleDateString(new Date())); }, []); // init

  if (!reservationData.loaded) return <Item icon={<Info />} type="info" label="Die Unternehmung ist noch nicht reservierbar" />;
  if (!fields.personAges || !fields.personAmount) return <EditPersons />;
  if (modalState === 'confirm' && fields.reservationTime && service && duration && durationList) return <Confirm foundation={foundation} changeState={changeState} service={service} activityID={activityID} serviceName={service.serviceName || 'nicht angegeben'} date={fields.calendar} personAmount={fields.personAmount} amountRooms={rooms} durationList={durationList} duration={duration} reservationTime={fields.reservationTime} />;

  return (
    <Fragment>
      <TopButton action={() => changeState('info')} />

      <BasicInput
        label="Wähle einen Tag"
        name="selectedDay"
        icon={<Calendar />}
        change={chooseDay}
        value={fields.selectedDay}
        type="date"
      />

      <Item icon={<UserPlus />} label="Für 1 Person" text="Passe die teilnehmenden Personen an" type="info" />

      {/* <Counter
        label={`Wie viele Personen? (max.: ${reservationData.available?.countMaxRoomPerson || 1} Pers.)`}
        name="personAmount"
        value={+fields.personAmount}
        min={1}
        max={reservationData.available?.countMaxRoomPerson || 1}
        change={changeField}
      /> */}

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

      {reservationData.isOpen && reservationData.available && service?.serviceType && duration && durationList ? (
        <Fragment>
          <Chip small type="active" label={`Die ${durationList.isRound ? 'Rundendauer' : 'Standartdauer'} beträgt ${durationList.isRound ? durationList.list[0] : duration} Min. ${durationList.isRound && duration !== '1' ? `(${durationList.list[0] * parseInt(duration, 10)} Min.` : ''}`} action={() => console.log('s')} />

          <Slots
            duration={parseInt(duration, 10)}
            durationList={durationList}
            amountRooms={rooms}
            chooseTime={chooseTime}
            serviceType={service.serviceType}
            personAmount={fields.personAmount}
            available={reservationData.available}
            reservations={reservationData.reservations}
            capacitys={reservationData.capacities}
            openings={openings}
          />
        </Fragment>
      ) : (
        reservationData.isOpen ? (<p class="red">Bitte wähle alle optionen</p>) : (
          <Item type="grey" icon={<Info />} label={`Nicht verfügbar (${fields.calendar})`} text="Bitte wähle einen geöffneten Tag aus" />
        )
      )}
    </Fragment>
  );
};

export default ReserveAvailable;
