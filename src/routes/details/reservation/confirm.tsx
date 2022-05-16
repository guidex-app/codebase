import { IconArchive, IconCalendar, IconClock, IconDeviceWatch, IconUserPlus } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import FormButton from '../../../components/form/basicButton';
import Item from '../../../components/item';
import TopButton from '../../../components/topButton';
import Popup from '../../../container/popup';
import useShoppingCart from '../../../hooks/useShoppingCart';
import { ServiceInfo } from '../../../interfaces/company';
import { ShoppingCart } from '../../../interfaces/reservation';
import Discounts from './discounts';
import style from './style.module.css';

interface ConfirmProps {
    service: ServiceInfo;
    serviceName: string;
    date: string;
    shortDay: string;
    durationList: { list: any; isRound: boolean; };
    duration: string;
    time: any;
    personAmount: number;
    amountRooms: number;
    foundation: 'person' | 'object';
    activityID: string;
    goBack: () => void;
}

const Confirm: FunctionalComponent<ConfirmProps> = ({ goBack, foundation, activityID, service, duration, durationList, serviceName, date, shortDay, personAmount, amountRooms, time }: ConfirmProps) => {
  const [discounts, setDiscounts] = useState<{ [key: string]: number }>({});
  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const { shoppingCart, isValid, totalPrice, contains } = useShoppingCart(foundation, duration, shortDay, durationList.isRound, time, amountRooms, personAmount, discounts, `activities/${activityID}/services/${service.id}/prices`);

  const changeDiscount = (newD: { [key: string]: number }) => {
    setDiscounts(newD);
    setShowDiscount(false);
  };

  const completeReservation = () => {
    // reserve(service.ID.serviceID, reservationTime, totalPrice, date, personAmount, title, amountRooms);
    // setFireDocument();
    console.log('reservieren');
    // changeState('finished');
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

  return (
    <Fragment>
      <TopButton title="Verfügbarkeiten" action={goBack} />

      <div class={`${style.price} ${isValid ? 'orange-bg' : 'red-bg'}`}>
        <div>
          {shoppingCart ? shoppingCart.map((cartItem: ShoppingCart) => (
            <p key={`${cartItem.discount}_${cartItem.room}_${cartItem.amount}`}>
              {`${cartItem.amount}x | ${cartItem.discount ? `${cartItem.discount}` : ''} für je: ${cartItem.price} €`}
              {amountRooms > 1 && <p style={{ opacity: '0.5' }}> (Raum: {cartItem.room} mit {cartItem.groupDiscount} Pers.)</p>}
            </p>
          )) : <p>&nbsp;</p>}
        </div>
        <strong>{totalPrice} €</strong>

      </div>
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
        <Item icon={<IconUserPlus />} label={personAmount > 1 ? `${personAmount} Personen (${amountRooms} Räume)` : `${personAmount} Person (${amountRooms} Raum)`} text={amountRooms.toString()} />
        <Item icon={<IconCalendar />} label="Datum" text={date} />
        <Item icon={<IconClock />} label="Uhrzeit" text={`${time} Uhr`} />
        <Item icon={<IconDeviceWatch />} label={durationList.isRound ? 'Runden' : 'Dauer'} text={durationList.isRound && duration ? `${duration} Runden (ca. ${parseInt(duration, 10) * durationList.list[0]} Min.)` : `${duration} Min.`} />
      </section>

      {!!totalPrice && <FormButton label={`Reservierung abschließen (${totalPrice}€)`} action={completeReservation} />}

      <small style={{ color: 'var(--fifth)' }}>
        Der Preis kann vorort leicht abweichen. Alle Informationen erhalten Sie per E-Mail, welche Sie in Ihrem Account angegeben haben.
      </small>
    </Fragment>
  );
};

export default Confirm;
