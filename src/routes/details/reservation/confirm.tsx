import { IconAlarm, IconArchive, IconBox, IconCalendar, IconClock, IconHourglass, IconUserPlus } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import FormButton from '../../../components/form/basicButton';
import Item from '../../../components/item';
import Spinner from '../../../components/spinner';
import TopButton from '../../../components/topButton';
import Popup from '../../../container/popup';
import { reserve } from '../../../data/fire';
import useShoppingCart from '../../../hooks/useShoppingCart';
import { ServiceInfo } from '../../../interfaces/company';
import { Reservation, ShoppingCart } from '../../../interfaces/reservation';
import Discounts from './discounts';
import style from './style.module.css';

interface ConfirmProps {
    service: ServiceInfo;
    serviceName: string;
    day: { date: string, shortDay: string };
    durationList: { list: any; isRound: boolean; };
    duration: string;
    rounds: number;
    time: any;
    personAmount: number;
    amountRooms: number;
    foundation: 'person' | 'object';
    activityID: string;
    uid?: string;
    goBack: () => void;
}

const Confirm: FunctionalComponent<ConfirmProps> = ({ goBack, foundation, uid, activityID, service, duration, durationList, serviceName, day, personAmount, amountRooms, time, rounds }: ConfirmProps) => {
  const [discounts, setDiscounts] = useState<{ [key: string]: number }>({});
  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const { shoppingCart, status, totalPrice, contains } = useShoppingCart(foundation, duration, day.shortDay, durationList.isRound, time, amountRooms, personAmount, discounts, `activities/${activityID}/services/${service.id}/prices`, rounds);

  const changeDiscount = (newD: { [key: string]: number }) => {
    setDiscounts(newD);
    setShowDiscount(false);
  };

  const completeReservation = () => {
    // reserve(service.ID.serviceID, reservationTime, totalPrice, date, personAmount, title, amountRooms);
    if (time && totalPrice && uid) {
      const reservationId = `GDX${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

      const reservationData: Reservation = {
        reservationId,
        uid,
        date: [new Date(day.date), new Date(day.date)],
        startTime: time,
        personAmount,
        rooms: amountRooms,
        rounds,
        duration: +duration,
        serviceName,
        ...(durationList.isRound ? { rounds } : {}),
        reservationStatus: {
          state: 'active',
          dateCreated: new Date(day.date),
          dateUpdated: new Date(day.date),
          emailSend: false,
          emailReceived: false,
        },
        totalPrice,
      };

      reserve(`activities/${activityID}/services/${service.id}`, reservationData);
      setFinished(true);
    }
  };

  // const changeValue = (value: any, key: 'ages' | 'discountName' | 'countGames' | 'onDuration' | string) => {
  //   if (key === 'discountName') {
  //     let isTruthy: boolean = true;
  //     const newValues: [string, number][] = Object.entries(value);
  //     newValues.forEach(([discountKeys, discountVal]: [string, number]) => {
  //       const getAge: string = discountKeys !== 'nothing' ? discountKeys.split('_')[0] : 'Erwachsene';
  //       const checkAge = (userValues.ages?.[getAge] && discountVal <= userValues.ages[getAge]) || !userValues.ages?.[getAge];
  //       isTruthy = checkAge && checkAge !== undefined ? checkAge : false;
  //     });

  //     if (isTruthy) {
  //       const newPrefs = { ...userValues, [key]: value };
  //       setUserValues(newPrefs);
  //     }
  //   } else {
  //     const newPrefs = { ...userValues, [key]: value, ...(key === 'ages' && { discountName: undefined }) };
  //     setUserValues(newPrefs);
  //   }
  // };
  if (finished) return <Item type="success" label="Reservierung abgeschlossen" text="Weitere Infos erhalten Sie per E-Mail" />;
  if (status === 'loading') return <Fragment><Spinner /><TopButton title="Verfügbarkeiten" action={goBack} /></Fragment>;
  return (
    <Fragment>
      <TopButton title="Verfügbarkeiten" action={goBack} />

      <div class={`${style.price}`}>

        {Array(amountRooms).fill(1).map((roomNr: number, indx: number) => (
          <table class={style.room}>
            {shoppingCart ? shoppingCart.filter((d) => indx + 1 === d.room).map((cartItem: ShoppingCart, dx: number) => (
              <Fragment>
                {dx === 0 && <tr class={style.head}><td><strong>{cartItem.room}. Raum ({cartItem.groupDiscount} Pers.)</strong></td></tr>}
                <tr class={style.row} key={`${cartItem.discount}_${cartItem.room}_${cartItem.amount}`}>
                  <td>{cartItem.amount}x {cartItem.discount ? `${cartItem.discount}` : ''}</td>
                  <td style={{ textAlign: 'right' }}>je: {cartItem.price} €</td>
                </tr>
              </Fragment>
            )) : <p>Es wurde kein Preis gefunden</p>}
          </table>
        ))}

      </div>
      {totalPrice > 0 && <strong class={style.totalPrice}>Gesamtpreis: {totalPrice} €</strong>}

      {(!!contains?.discount?.[0]) && (
      <Fragment>
        <Item type="info" icon={<IconUserPlus color="var(--orange)" />} label="Rabatt hinzufügen" text="Klick um einen Rabatt auszuwählen" action={() => setShowDiscount(true)} />
        {showDiscount && (
        <Popup close={() => setShowDiscount(false)}>
          <Discounts maxPersons={personAmount} list={contains.discount} values={discounts} change={changeDiscount} />
        </Popup>
        )}
      </Fragment>
      )}
      <section class="group form">

        {/* <Item icon={<Clock color="#ffa500" />} type="info" label={`Deine Reservierung für ${reservationTime} Uhr ${amountRooms >= 2 ? `(Für ${amountRooms} Räume)` : ''} ${durationList.isRound ? `(${duration} Runden)` : ''}`} /> */}
        <Item icon={<IconArchive />} label="Leistung" text={serviceName} />
        <Item icon={<IconUserPlus />} label={personAmount > 1 ? `${personAmount} Personen` : '1 Person'} text={amountRooms.toString()} />
        {amountRooms > 1 && <Item icon={<IconBox />} label={`${amountRooms} Räume`} />}
        <Item icon={<IconCalendar />} label="Datum" text={day.date} />
        <Item icon={<IconClock />} label="Uhrzeit" text={`${time} Uhr`} />
        {durationList.isRound && <Item icon={<IconAlarm />} label="Runden" text={`${rounds} Runden (${durationList.list[0]} Min. pro Runde)`} />}
        <Item icon={<IconHourglass />} label="Dauer" text={`${+duration * (durationList.isRound ? rounds : 1)} Min. (insgesamt)`} />
      </section>

      {!!totalPrice && <FormButton label={`Reservierung abschließen (${totalPrice}€)`} action={completeReservation} />}

      <small style={{ color: 'var(--fifth)' }}>
        Der Preis kann vorort leicht abweichen. Alle Informationen erhalten Sie per E-Mail, welche Sie in Ihrem Account angegeben haben.
      </small>
    </Fragment>
  );
};

export default Confirm;
