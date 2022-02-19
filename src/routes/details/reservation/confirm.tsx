import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Archive, Calendar, Clock, UserPlus } from 'react-feather';

import FormButton from '../../../components/form/basicButton';
import Item from '../../../components/item';
import TopButton from '../../../components/topButton';
import Popup from '../../../container/popup';
import useShoppingCart from '../../../hooks/useShoppingCart';
import { ServiceInfo } from '../../../interfaces/company';
import { ShoppingCart, UserValues } from '../../../interfaces/reservation';
import Discounts from './discounts';
import style from './style.module.css';

interface ConfirmProps {
    service: ServiceInfo;
    serviceName: string;
    date: string;
    durationList: { list: any; isRound: boolean; };
    duration: string;
    time: any;
    personAmount: number;
    amountRooms: number;
    foundation: 'person' | 'object';
    activityID: string;
    goBack: () => void;
}

const Confirm: FunctionalComponent<ConfirmProps> = ({ goBack, foundation, activityID, service, duration, durationList, serviceName, date, personAmount, amountRooms, time }: ConfirmProps) => {
  const [discounts, setDiscounts] = useState<UserValues>({});
  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const { shoppingCart, isValid, totalPrice, contains } = useShoppingCart(foundation, duration, date, durationList.isRound, time, amountRooms, personAmount, discounts, `activities/${activityID}/services/${service.id}/prices`);

  /**
     * Reservierung Abgeschließen Button
     */
  //   const completeReservation = () => {
  //     // reserve(service.ID.serviceID, reservationTime, totalPrice, date, personAmount, title, amountRooms);
  //     changeState('finished');
  //   };

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
      <TopButton action={goBack} />

      <div class={`${style.price} ${isValid ? 'orange-bg' : 'red-bg'}`}>
        {isValid === 'valid' && shoppingCart && (
          <Fragment>
            <div>
            {shoppingCart.map((cartItem: ShoppingCart) => (
              <p key={`${cartItem.age}_${cartItem.discount}_${cartItem.room}_${cartItem.amount}`}>
                {`${cartItem.amount}x | ${cartItem.age} ${cartItem.discount ? `(${cartItem.discount})` : ''} für je: ${cartItem.price} €`}
                {amountRooms > 1 && <p style={{ opacity: '0.5' }}> (Raum: {cartItem.room} mit {cartItem.groupDiscount} Pers.)</p>}
              </p>
            ))}
            </div>
            <strong>{totalPrice} €</strong>
          </Fragment>
        )}
      </div>

      <section class="group form">
        {!!contains?.discount?.[0] || !!contains?.age?.[0] && <Item label="Rabatt hinzufügen" text="Klick um einen Rabatt auszuwählen" action={() => setShowDiscount(true)} />}
        {/* <Item icon={<Clock color="#ffa500" />} type="info" label={`Deine Reservierung für ${reservationTime} Uhr ${amountRooms >= 2 ? `(Für ${amountRooms} Räume)` : ''} ${durationList.isRound ? `(${duration} Runden)` : ''}`} /> */}
        <Item icon={<Archive />} label="Leistung" text={serviceName} />
        <Item icon={<UserPlus />} label="3 Personen (2 Räume)" text={amountRooms.toString()} />
        <Item icon={<Calendar />} label="Datum" text={date} />
        <Item icon={<Clock />} label="Uhrzeit" text={`${time} Uhr`} />
        <Item icon={<Clock />} label={durationList.isRound ? 'Runden' : 'Dauer'} text={durationList.isRound && duration ? `${duration} Runden (ca. ${parseInt(duration, 10) * durationList.list[0]} Min.)` : `${duration} Min.`} />
      </section>

      {!!totalPrice && <FormButton label={`Reservierung abschließen (${totalPrice}€)`} />}

      <small class="grey">
        Der Preis kann vorort leicht abweichen. Alle Informationen erhalten Sie per E-Mail, welche Sie in Ihrem Account angegeben haben.
      </small>

      {showDiscount && (
      <Popup close={() => setShowDiscount(false)}>
        <Discounts maxPersons={2} ageList={[]} discountList={[]} values={{}} change={() => console.log('s')} />
        </Popup>
      )}
    </Fragment>
  );
};

export default Confirm;
