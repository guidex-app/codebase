import { useEffect, useState } from 'preact/hooks';

import { getFireCollection } from '../data/fire';
import { ContainsList, PriceItem, ShoppingCart, UserValues } from '../interfaces/reservation';

const useShoppingCart = (foundation: 'person' | 'object', duration: string, shortDay: string, isRound: boolean, time: string, amountRooms: number, personAmount: number, discounts: UserValues, pricePath: string) => {
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isValid, setIsValid] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [contains, setContains] = useState<ContainsList>();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>();

  /**
   * Generiert die DurationID
   * Wenn es Runde ist, wird zuerst gecheck ob rundenrabatte vorhanden sind,
   * sonst wird der Preis für eine Runde genommen.
   */
  // const persDurationID = (amountPers: number, durationOrRound: number): string => `_${amountPers}_${durationOrRound}`;
  const getPrice = (price: number) => (isRound ? price * parseInt(duration, 10) : price);

  /**
   * Holt sich den korrekten Preis, unter berücksichtigung von rundenrabatt und personen rabatt
   */
  // const getPriceWithProps = (persons: number, price?: number): number => {
  //   const nDuration = parseInt(duration, 10);

  //   const durationPrice: number | undefined = price?.[persDurationID(persons, nDuration)] || price?.[persDurationID(1, nDuration)];
  //   if (durationPrice) return getPrice(durationPrice);

  //   const personPrice: number | undefined = price?.[persDurationID(persons, 1)] || price?.[persDurationID(1, 1)];
  //   return personPrice ? getPrice(personPrice) : 0;
  // };

  /**
   * Sucht einen passenden Preis, für die angegebenen Paramter.
   */
  const getSinglePrice = (terms: { persons: number, discount: (false | string), age: string, day: string }) => {
    const included = {
      day: contains?.day.indexOf(shortDay) !== -1,
      time: contains?.time.indexOf(time) !== -1,

      age: contains?.age.includes(terms.age),
      persons: contains?.persons.includes(terms.persons),
      discount: terms.discount && contains?.discount.includes(terms.discount),
    };

    const findPrice: PriceItem | undefined = priceList.find((item: PriceItem) => {
      const timeSplitted = item.time && item.time.split('-');
      const timeCompare = timeSplitted && (time >= timeSplitted[0] && time <= timeSplitted[1]);

      if ((included.time && !timeCompare) || +duration !== item.duration) return false;

      const checkList: ['persons', 'discount', 'age', 'day'] = ['persons', 'discount', 'age', 'day'];
      const defaultValues = { day: 'nothing', persons: 1, discount: false, age: false };
      return checkList.every((v) => {
        if (included[v]) return item[v] === terms[v] || (v === 'day' && item.day.indexOf(terms.day) !== -1);
        return item[v] === defaultValues[v];
      });
    });

    console.log('Preis gefunden', findPrice?.price);
    return getPrice(findPrice?.price || 0);
  };

  /**
   * [12, 11] wir erstellen die gruppengrößen (für den möglichen gruppenrabatt)
   */
  const splitInGroups = (maxPersons: number): number[] => {
    const group: number[] = [];
    let room = 0;
    for (let index = 0; index < maxPersons; index += 1) {
      group[room] = group[room] ? group[room] + 1 : 1;
      room = room + 1 !== amountRooms ? room + 1 : 0;
    }
    return group;
  };

  /**
     * Berechnet die Anzahl der überbleibenden Erwachsenen
     */
  const getAdults = (prf?: { [key: string]: number }): number => {
    const newPrf = prf || discounts.ages;
    return personAmount - (newPrf ? Object.values(newPrf).reduce((a, b) => a + b, 0) : 0);
  };

  const arePricesValid = (newCart: ShoppingCart[]): boolean => {
    const isInvalid = newCart.findIndex((x) => x.price === 0) > -1;
    return !isInvalid;
  };

  /**
     * Es wird ein Shoppingcart erstellt, welcher für alle angegebenen
     * Personen den Preis berechnet, dabei wird rücksicht auf jegliche
     * Art Rabatt genommen.
     * (für alle gleich: runden, dauer, uhrzeit, tag
     * unterschiedlich: discount, alter, personen)
     */
  const createShoppingCart = () => {
    if (!priceList?.[0]) setIsValid('invalid');
    setIsValid('loading');

    const adultsNr: number = getAdults(discounts.ages); // erwachsene
    const otherAgesAreThere: boolean = !!(personAmount !== adultsNr && discounts.ages && contains?.age.length !== 0); // wenn nicht alles erwachsene sind und noch andere ages definiert sind
    const createAges: { [key: string]: number } = otherAgesAreThere ? { ...discounts.ages, Erwachsene: adultsNr } : { Erwachsene: personAmount };

    const newShoppingCart: ShoppingCart[] = [];
    const allDiscounts: [string, number][] = Object.entries(discounts.discountName || {});
    const grouSizes: number[] = splitInGroups(personAmount);
    const isInUse: { [key: string]: number } = {};
    let isInRoom = 0;

    const pushToCart = (age: string, amount: number, discount?: string) => {
      if (amount >= 1) {
        isInUse[age] = (isInUse[age] || 0) + amount;

        const groupDiscount: number[] = splitInGroups(amount);
        groupDiscount.forEach((element) => {
          const price = getSinglePrice({ persons: grouSizes[isInRoom], age, discount: discount || false, day: shortDay }) || 0;
          newShoppingCart.push({ age, ...(discount && { discount }), amount: element, groupDiscount: grouSizes[isInRoom], room: isInRoom + 1, price });
          isInRoom = isInRoom + 1 < amountRooms ? isInRoom + 1 : 0;
        });
      }
    };

    Object.entries(createAges).forEach(([age, ageNr]) => { // wir gehen durch ['Erwachsen', '6-14']
      allDiscounts.forEach(([discount, discNr]) => { // wir gehen durch ['nothing', 'Sale', '10 Karte']
        if (discount.split('_')[0] === age) pushToCart(age, discNr, discount);
      });
      const getNothingAge = ageNr - (isInUse[age] || 0);
      pushToCart(age, getNothingAge);
    });

    console.log('Cart', newShoppingCart);
    console.log('Preise', priceList);

    if (arePricesValid(newShoppingCart)) {
      setShoppingCart(newShoppingCart);
      if (foundation === 'person') {
        setTotalPrice(newShoppingCart.reduce((prev, cur) => prev + (cur.price * cur.amount), 0));
      } else {
        setTotalPrice(newShoppingCart.reduce((prev, cur) => prev + (cur.price * 1), 0));
      }

      return setIsValid('valid');
    }
    setIsValid('invalid');
  };

  const loadPriceData = () => {
    getFireCollection(pricePath, false).then((priceData: PriceItem[]) => {
      if (priceData) {
        const isThere: ContainsList = {
          day: [],
          time: [],
          discount: [],
          age: [],
          persons: [],
        };

        priceData.forEach((x) => {
          if (x?.persons && x.persons !== 1 && !isThere?.persons.includes(x.persons)) isThere.persons.push(x.persons);
          if (x?.day && x?.day !== 'nothing' && !isThere?.day.includes(x.day)) isThere.day.push(x.day);
          if (x?.time && !isThere?.time.includes(x.time)) isThere.day.push(x.time);
          if (x?.discount && isThere?.discount.indexOf(x.discount) === -1) isThere?.discount.push(x.discount);
          if (x?.age && isThere?.age.indexOf(x.age) === -1) isThere?.age.push(x.age);
        });

        setPriceList(priceData);
        setContains(isThere);
      }
    });
  };

  useEffect(() => { if (priceList[0] && contains) createShoppingCart(); }, [contains, discounts]); // Preise werden neu berechnet
  useEffect(() => { loadPriceData(); }, [pricePath]); // init (Preise werden geladen)

  return { shoppingCart, isValid, totalPrice, contains, getAdults };
};

export default useShoppingCart;
