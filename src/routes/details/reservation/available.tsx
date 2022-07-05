/* eslint-disable no-nested-ternary */
import { IconAlarm, IconHourglass, IconUserPlus } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Chip from '../../../components/chip';
import Counter from '../../../components/form/counter';
import DaySlider from '../../../components/form/daySlider';
import SelectInput from '../../../components/form/Inputs/select';
import Item from '../../../components/item';
import OpeningList from '../../../components/openingList/openings';
import Spinner from '../../../components/spinner';
import TopButton from '../../../components/topButton';
import { getFireMultiCollection } from '../../../data/fire';
import { generateDateString, getCurrentShortname, getSimpleDateString, shortDay } from '../../../helper/date';
import getQuestFormList from '../../../helper/priceStructure';
import useForm from '../../../hooks/useForm';
import { ServiceField, ServiceInfo } from '../../../interfaces/company';
import { Available, Capacity, ReservationSlot } from '../../../interfaces/reservation';
import Confirm from './confirm';
import Slots from './slots/slots';

interface ReserveAvailableProps {
    service: ServiceInfo;
    openings: (string | false)[];
    activityID: string;
    day?: string;
    uid?: string;
    changeState: (type: 'info' | 'available' | 'finished' | undefined) => void;
}

const ReserveAvailable: FunctionalComponent<ReserveAvailableProps> = ({ service, uid, activityID, day, openings, changeState }: ReserveAvailableProps) => {
  const [durationList, setDurationList] = useState<{ list: any; isRound: boolean }>();
  const [duration, setDuration] = useState<string>('');
  const [foundation, setFoundation] = useState<'person' | 'object'>('person');
  const [rooms, setRooms] = useState<number>(1);

  const { form, changeForm } = useForm({
    selectedDay: undefined, // aktueller Tag
    selectedShortDay: undefined,
    rounds: 1,
    duration: undefined, // ausgewählte dauer
    personAmount: 1, // alters rabatt
    amountRooms: undefined,
    reservationTime: undefined, // aktuelle slot auswahl
  });
  const [show, setShow] = useState<'confirm' | 'slots'>('slots');
  const [reservationData, setReservationData] = useState<{
    structure?: ServiceField[]; // Preisstrukture
    available?: Available; // Verfügbarkeitsinfos
    capacities?: Capacity[]; // Verfügbarkeiten der Uhrzeiten
    reservations?: ReservationSlot[]; // Reservierungen
    ageList?: string[];
    isOpened?: boolean;
    loaded: boolean; // geladen
  }>({
    isOpened: false,
    loaded: false,
  });

  const chooseTime = (time: string) => {
    if (duration) {
      changeForm(time, 'reservationTime');
      setShow('confirm');
    }
  };

  /** Berechnet die Raum Anzahl * */
  const calculateRooms = (from: number, maxPersons: number) => Math.ceil(from / maxPersons);
  const choosePerson = (amount: number) => {
    const maxPersons = reservationData.available?.countMaxRoomPerson || 1;
    // if (amount <= maxPersons) {
    changeForm(amount, 'personAmount');
    changeForm(calculateRooms(amount, maxPersons), 'amountRooms');
    // }
  };

  const chooseDay = (newDay: string) => {
    changeForm(newDay, 'selectedDay');
    changeForm(getCurrentShortname(new Date(newDay).getDay()), 'selectedShortDay');
  };

  /**
   * Wir holen uns die richtigen Dauern.
   * Wenn es Runden sind, werden sie mal die angegebene Dauer gerechnet.
   * Wenn Min. oder Runden Tagesabhängig sind, überprüfen wir sie mit dem gewähltem Tag.
   * !!Tageskarten neu unterbringen.
   */
  const setUpDuration = () => {
    const { list = [], isRound = false } = getQuestFormList(form.selectedShortDay, reservationData.structure?.find((x) => x.name === 'duration')?.selected);
    if (list.length >= 1) setDuration(list[0]);
    setDurationList({ list, isRound });
  };

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
      const currentDay: Date = new Date(form.selectedDay);
      const currentDayID = generateDateString(currentDay);
      getFireMultiCollection([
        { path: `activities/${activityID}/services/${service.id}/reserved`, where: [['date', '==', currentDayID]] },
        { path: `activities/${activityID}/available/${service.id}/capacity`, where: [['date', '==', currentDayID]] },
      ]).then(([reservations, capacities]: [ReservationSlot[], Capacity[]]) => {
        setUpDuration();
        setReservationData({
          ...reservationData,
          reservations,
          capacities,
          loaded: true,
        });
      });
    }
  };

  const loadReservationData = () => {
    const isOpened: boolean = !!openings?.[shortDay.indexOf(form.selectedShortDay)];
    if (!isOpened) return setReservationData({ ...reservationData, isOpened });

    getFireMultiCollection([
      { path: `activities/${activityID}/structures/${service.structureID}/fields` },
      { path: `activities/${activityID}/available/${service.id}`, isDocument: true },
    ]).then(([structure, available]: [ServiceField[], Available]) => {
      if (structure && available) {
        const getFoundation: 'person' | 'object' = (getQuestFormList(form.selectedShortDay, structure?.find((x) => x.name === 'foundation')?.selected)?.list?.[0] || 'person') as ('person' | 'object');
        const ageList: string[] = getQuestFormList(form.selectedShortDay, structure?.find((x) => x.name === 'age')?.selected)?.list;
        setFoundation(getFoundation);
        if (form.personAmount < available.countMinPerson) changeForm(available.countMinPerson, 'personAmount');
        setReservationData({ structure, available, ageList, isOpened, loaded: false });
      }
    });
  };

  useEffect(() => {
    if (form.personAmount && reservationData.available?.countMaxRoomPerson) {
      setRooms(calculateRooms(form.personAmount, reservationData.available.countMaxRoomPerson));
    }
  }, [form.personAmount]);

  useEffect(() => { loadReservationData(); }, [form.selectedDay]); // init einer leistung
  useEffect(() => { loadDayData(); }, [reservationData.structure]);
  useEffect(() => { chooseDay(getSimpleDateString(day ? new Date(day) : new Date())); }, []); // init

  if (show === 'confirm' && form.reservationTime && service && duration && durationList) return <Confirm goBack={() => setShow('slots')} uid={uid} foundation={foundation} service={service} activityID={activityID} serviceName={service.serviceName || 'nicht angegeben'} day={{ date: form.selectedDay, shortDay: form.selectedShortDay }} personAmount={form.personAmount} amountRooms={rooms} durationList={durationList} duration={duration} rounds={form.rounds} time={form.reservationTime} />;

  return (
    <Fragment>
      <TopButton title="Infos" action={() => changeState('info')} />

      {/* <NormalInput
        name="selectedDay"
        label="Tag auswählen"
        icon={<IconCalendar color="var(--lila)" />}
        change={chooseDay}
        value={form.selectedDay}
        type="date"
      /> */}
      <DaySlider
        // label="Tag auswählen"
        openedDays={shortDay.filter((x, indx) => !!openings[indx])}
        name="selectedDay"
        value={form.selectedDay}
        change={chooseDay}
      />

      {reservationData.loaded && reservationData.isOpened && reservationData.available && service?.serviceType && duration && durationList ? (
        <Fragment>
          <div style={{ backgroundColor: 'var(--orange)', padding: '5px', borderRadius: '10px' }}>
            <Counter
              name="personAmount"
              label="Anzahl an Personen"
              group
              text={reservationData.available.countMinPerson > 1 ? `Die Mindestanzahl beträgt ${reservationData.available.countMinPerson} Personen` : `Die Maximalanzahl pro Raum beträgt ${reservationData.available.countMaxRoomPerson} Personen`}
            // max={reservationData.available?.countMaxRoomPerson || 1}
              icon={<IconUserPlus color="var(--orange)" />}
              change={choosePerson}
              value={form.personAmount}
            />

            {durationList.isRound ? (
              <Counter icon={<IconAlarm color="var(--orange)" />} label="Anzahl an Runden" text={`Die Rundendauer beträgt ${durationList.list[0]} Min. (Σ ${durationList.list[0] * form.rounds} Min.)`} name="rounds" value={form.rounds} change={changeForm} max={10} min={1} />
            ) : (durationList?.list[1]) ? (
              <SelectInput
                label="Für welche Dauer?"
                name="duration"
                value={duration}
                options={durationList?.list}
                change={setDuration}
              />
            ) : (<Item icon={<IconHourglass color="var(--orange)" />} background="#2b303d" label="Dauer" text={`Die Dauer beträgt ${duration} Min.`} />)}

            {foundation === 'object' && <Chip type="active" label={`Anzahl der Räume ${form.amountRooms || '1'}`} action={() => console.log('s')} />}
          </div>

          <Slots
            duration={parseInt(duration, 10)}
            durationList={durationList}
            amountRooms={rooms}
            chooseTime={chooseTime}
            serviceType={service.serviceType}
            personAmount={form.personAmount}
            available={reservationData.available}
            reservations={reservationData.reservations}
            capacitys={reservationData.capacities}
            openings={openings}
          />
        </Fragment>
      ) : (
        <div>
          {!reservationData.isOpened && reservationData.loaded ? (
            <div style={{ backgroundColor: 'var(--orange)', padding: '5px', borderRadius: '10px' }}>
              <h3>{`Am ${form.selectedShortDay}. ist leider nicht geöffnet`}</h3>
              <OpeningList openings={openings} />
            </div>
          ) : <Spinner /> }
        </div>

      )}

    </Fragment>
  );
};

export default ReserveAvailable;
