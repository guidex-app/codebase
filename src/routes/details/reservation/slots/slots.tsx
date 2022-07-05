import { Fragment, FunctionalComponent, h } from 'preact';

import useTimeLine, { calculateTime } from '../../../../hooks/useTimeLine';
import { Available, Capacity, ReservationSlot } from '../../../../interfaces/reservation';
import style from './style.module.css';

interface SlotsProps {
  available: Available;
  personAmount: number;
  amountRooms: number;
  serviceType: 'entry' | 'section' | 'object';
  durationList: { list: any; isRound: boolean };
  duration: number;
  openings: (string | false)[];

  capacitys?: Capacity[];
  reservations?: ReservationSlot[];
  chooseTime: (time: string) => void;
}

const Slots: FunctionalComponent<SlotsProps> = ({ capacitys, available, serviceType, amountRooms, duration, durationList, reservations, personAmount, openings, chooseTime }: SlotsProps) => {
  const timeLine = useTimeLine(30, openings);

  const getDefaultCapacity = (time: string): number => capacitys?.find((x) => x.time === time)?.value || available.defaultCapacity;

  /**
   * Gibt die noch freien Plätze der aktuellen Zeit und capacity als Zahl zurück.
   * Die defaultCapacity - die schon reservierten plätze rechnen.
   */
  const getFreePlaces = (time: string, capacity: number): number => {
    const reservationsSlots: number = reservations?.find((x) => x.startTime === time)?.personAmount || 0;
    return capacity - reservationsSlots;
  };

  /**
   * Erstellt ein Array den von der Dauer eingeschlossenen Zeiten. Abhängig der mitgegebenen Zeit.
   */
  const getIncludedTimes = (time: string): string[] => {
    const includedTimes: string[] = []; //
    const getDuration = durationList.isRound ? durationList.list[0] * duration : duration;

    const endTime = calculateTime(time, getDuration.toString());
    for (let index = 30; calculateTime(time, index.toString()) <= endTime; index += 30) {
      includedTimes.push(calculateTime(time, index.toString()));
    }

    return includedTimes;
  };

  /**
   * Gibt die Capacity unter berücksichtigung der User eingaben zurück
   */
  const getUserInputCapacity = (capacity: number) => {
    const roomsOrPersons: number = serviceType !== 'entry' ? amountRooms : personAmount;
    return capacity - roomsOrPersons;
  };

  /**
   * Checkt ob alle Included Times noch für den mitgegbenen Slot verfügbar sind.
   * - Wenn der Slot nicht verfügbar ist wird '-1' zurückgegeben
   * - Wenn die included Times nicht verfügbar sind '-100'
   */
  const checkSlotAvail = (startTime: string): number => {
    let currentFreePlaces = getFreePlaces(startTime, getDefaultCapacity(startTime));

    if (currentFreePlaces >= 0) { // wenn starttime verfügbar werden die weiteren gecheckt
      const includedTimes: string[] = getIncludedTimes(startTime);
      includedTimes.forEach((element: string) => { // ["12:00", "12:30"]
        if (currentFreePlaces >= 1) {
          const availCapacity = getFreePlaces(element, getDefaultCapacity(element));
          const userInputCapacity = getUserInputCapacity(availCapacity);
          if (userInputCapacity < 0) { currentFreePlaces = -100; }
        }
      });
    } else {
      return -1;
    }

    return currentFreePlaces;
  };

  if (!personAmount) return <div style={{ color: 'var(--fifth)' }}>Wähle mindestens 1 Person</div>;
  if (!available) return <div style={{ color: 'var(--fifth)' }}>Es sind momentan leider keine Reservierungen möglich</div>;

  return (
    <div class={style.slots}>
      {timeLine.map((time: string) => {
        const availCapacity: number = checkSlotAvail(time);
        const userInputCapacity: number = getUserInputCapacity(availCapacity);

        return (
          <div role="button" tabIndex={0} onClick={() => userInputCapacity > 0 && chooseTime(time)} key={time}>
            <strong>{time}</strong>

            {availCapacity > 5 && userInputCapacity >= 0 && <span style={{ color: 'var(--green)' }}>Es sind noch ausreichend {serviceType !== 'entry' ? 'Räume' : 'Plätze'} verfügbar</span>}
            {((availCapacity >= 1 && userInputCapacity < 0) || availCapacity === -100) && <span style={{ color: 'var(--orange)' }}>Für Deine Auswahl nicht mehr verfügbar</span>}
            {availCapacity <= 5 && userInputCapacity >= 0 && (
              <span style={{ color: 'var(--red)' }}>
                Es sind nur noch {`${availCapacity} ${serviceType !== 'entry' ? 'Räume' : 'Plätze'}`} verfügbar
              </span>
            )}

            {availCapacity <= 0 && availCapacity !== -100 && (
              <Fragment>
                <span style={{ color: 'var(--red)' }}>Knapp verpasst</span><br />
                <span style={{ color: 'var(--fifth)' }}><small>Diese Uhrzeit ist leider nicht mehr Verfügbar</small></span>
              </Fragment>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default Slots;
