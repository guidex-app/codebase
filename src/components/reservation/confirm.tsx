import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Calendar, Clock, Type } from 'react-feather';
import { ServiceInfo } from '../../interfaces/company';
import { ShoppingCart, UserPreferences } from '../../interfaces/reservation';
import FormButton from '../form/basicButton';
import SelectInput from '../form/selectInput';
import Item from '../item';
import useShoppingCart from '../../hooks/useShoppingCart';
import style from './style.module.css';
import TopButton from '../topButton';

interface ConfirmProps {
    service: ServiceInfo;
    serviceName: string;
    date: string;
    durationList: { list: any; isRound: boolean; };
    duration: string;
    reservationTime: any;
    personAmount: number;
    amountRooms: number;
    foundation: 'person' | 'object';
    activityID: string;
    changeState: (type?: 'info' | 'available' | 'confirm' | 'finished') => void;
}

const Confirm: FunctionalComponent<ConfirmProps> = ({ changeState, foundation, activityID, service, duration, durationList, serviceName, date, personAmount, amountRooms, reservationTime }: ConfirmProps) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const { shoppingCart, isValid, totalPrice, priceSpecs, getAdults } = useShoppingCart(foundation, duration, durationList.isRound, new Date(date).getDay(), reservationTime, amountRooms, personAmount, userPreferences, activityID, service.id);

  /**
     * Reservierung Abgeschließen Button
     */
  //   const completeReservation = () => {
  //     // reserve(service.ID.serviceID, reservationTime, totalPrice, date, personAmount, title, amountRooms);
  //     changeState('finished');
  //   };

  const changeValue = (value: any, key: 'ages' | 'discountName' | 'countGames' | 'onDuration' | string) => {
    if (key === 'discountName') {
      let isTruthy: boolean = true;
      const newValues: [string, number][] = Object.entries(value);
      newValues.forEach(([discountKeys, discountVal]: [string, number]) => {
        const getAge: string = discountKeys !== 'nothing' ? discountKeys.split('_')[0] : 'Erwachsene';
        const checkAge = (userPreferences.ages?.[getAge] && discountVal <= userPreferences.ages[getAge]) || !userPreferences.ages?.[getAge];
        isTruthy = checkAge && checkAge !== undefined ? checkAge : false;
      });

      if (isTruthy) {
        const newPrefs = { ...userPreferences, [key]: value };
        setUserPreferences(newPrefs);
      }
    } else {
      const newPrefs = { ...userPreferences, [key]: value, ...(key === 'ages' && { discountName: undefined }) };
      setUserPreferences(newPrefs);
    }
  };

  const renderDiscount = () => {
    const getAges: string[] | undefined = userPreferences.ages && Object.entries(userPreferences.ages)
      .filter(([, value]: [string, number]) => value >= 1)
      .map(([key]: [string, number]) => key);
    if (getAges && getAdults() >= 1) getAges.push('Erwachsene');
    if (priceSpecs && priceSpecs.discounts?.length !== 0) {
      const getDiscountList: string[] = getAges ? getAges.map((ageName: string | undefined) => priceSpecs?.discounts.map((x: string) => `${ageName}_${x}`)).flat() : priceSpecs.discounts;
      return (
        <SelectInput
          name="discountName"
        //   maxNumber={personAmount}
        //   value={userPreferences.discountName}
          options={getDiscountList}
          label="Bitte wählen sie Ihre Rabatte aus"
        //   submitted={false}
          change={changeValue}
        />
      );
    }
  };

  return (
    <Fragment>
      <TopButton action={() => changeState('available')} />

      <div class={`${style.price} ${isValid ? 'orange-bg' : 'red-bg'}`}>
        {isValid === 'valid' && shoppingCart ? (
          <Fragment>
            {shoppingCart.map((cartItem: ShoppingCart) => (
              <p key={`${cartItem.age}_${cartItem.discount}_${cartItem.room}_${cartItem.amount}`}>
                {`${cartItem.amount}x | ${cartItem.age} ${cartItem.discount ? `(${cartItem.discount})` : ''} für je: ${cartItem.price} €`}
                {amountRooms > 1 && <p style={{ opacity: '0.5' }}> (Raum: {cartItem.room} mit {cartItem.groupDiscount} Pers.)</p>}
              </p>
            ))}
            <strong>Gesamtsumme: {totalPrice} € (Fällt vorort an)</strong>
          </Fragment>
        ) : (
          <strong>Es wurde kein Preis gefunden</strong>
        )}

        <small>
          Der Preis kann vorort leicht abweichen. Alle Informationen erhalten Sie per E-Mail, welche Sie in Ihrem Account angegeben haben.
        </small>
      </div>

      {priceSpecs?.ages && priceSpecs?.ages.length !== 0 && (
      <SelectInput
        name="ages"
            // prefix={`Erwachsene: ${getAdults()}`}
        // maxNumber={personAmount}
        // value={userPreferences.ages}
        options={priceSpecs.ages}
        label="Bitte ordnen Sie sich zu"
        // submitted={false}
        change={changeValue}
      />
      )}
      {priceSpecs?.discounts && priceSpecs?.discounts.length !== 0 && renderDiscount()}

      <section class="group form">
        <Item icon={<Clock color="#ffa500" />} type="info" label={`Deine Reservierung für ${reservationTime} Uhr ${amountRooms >= 2 ? `(Für ${amountRooms} Räume)` : ''} ${durationList.isRound ? `(${duration} Runden)` : ''}`} />
        <Item icon={<Type />} label="Leistung" text={serviceName} />
        <Item icon={<Clock />} label="Anz. Räume" text={amountRooms.toString()} />
        <Item icon={<Calendar />} label="Datum" text={date} />
        <Item icon={<Calendar />} label="Uhrzeit" text={`${reservationTime} Uhr`} />
        <Item icon={<Clock />} label={durationList.isRound ? 'Runden' : 'Dauer'} text={durationList.isRound && duration ? `${duration} Runden (ca. ${parseInt(duration, 10) * durationList.list[0]} Min.)` : `${duration} Min.`} />
      </section>

      {!!totalPrice && <FormButton label={`Reservierung abschließen (${totalPrice}€)`} action={() => changeState()} />}
    </Fragment>
  );
};

export default Confirm;
