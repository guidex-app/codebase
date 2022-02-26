import { useEffect, useState } from 'preact/hooks';

import { getFireCollection } from '../data/fire';
import { sumOf } from '../helper/array';
import { isInTimeRange } from '../helper/date';
import { ContainsList, PriceItem, ShoppingCart } from '../interfaces/reservation';

const useShoppingCart = (foundation: 'person' | 'object', duration: string, shortDay: string, isRound: boolean, time: string, amountRooms: number, personAmount: number, discounts: { [key: string]: number }, pricePath: string) => {
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
  const getSinglePrice = (terms: { persons: number, discount: string, day: string }) => {
    console.log('terms', terms);
    const included = {
      day: contains?.day.findIndex((d) => d.indexOf(terms.day) !== -1) !== -1,
      time: contains?.time.findIndex((cTime: string) => isInTimeRange(time, cTime)) !== -1,

      persons: contains?.persons.includes(terms.persons),
      discount: contains?.discount.includes(terms.discount),
    };

    console.log('included', included);

    const findPrice: PriceItem | undefined = priceList.find((item: PriceItem) => {
      if (included.time && !isInTimeRange(time, item.time)) return false;

      const checkList: ['persons', 'discount', 'day'] = ['persons', 'discount', 'day'];
      const defaultValues: any = { day: 'nothing', persons: 1, discount: false };

      return checkList.every((v) => {
        if (included[v]) return item[v] === terms[v] || (v === 'day' && item.day.indexOf(terms.day) !== -1);
        return item[v] === defaultValues[v];
      });
    });

    console.log('Preis gefunden', findPrice?.price);
    console.log('contains', contains);
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
  const getAdults = (): number => personAmount - sumOf(Object.values(discounts));

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

    const adultsNr: number = getAdults(); // erwachsene
    const otherAgesAreThere: boolean = !!(personAmount !== adultsNr && discounts && contains?.discount.length !== 0); // wenn nicht alles erwachsene sind und noch andere ages definiert sind
    const discList: { [key: string]: number } = otherAgesAreThere ? { ...discounts, Personen: adultsNr } : { Personen: personAmount };

    const newShoppingCart: ShoppingCart[] = [];

    const grouSizes: number[] = splitInGroups(personAmount);
    const isInUse: { [key: string]: number } = {}; // anzahlen
    let isInRoom = 0;

    const pushToCart = (discount: string, amount: number) => {
      if (amount >= 1) {
        isInUse[discount] = (isInUse[discount] || 0) + amount;

        const groupDiscount: number[] = splitInGroups(amount);
        groupDiscount.forEach((groupCount: number) => {
          const price = getSinglePrice({ persons: grouSizes[isInRoom], discount, day: shortDay.toLocaleLowerCase() }) || 0;
          newShoppingCart.push({ discount, amount: groupCount, groupDiscount: grouSizes[isInRoom], room: isInRoom + 1, price });
          isInRoom = isInRoom + 1 < amountRooms ? isInRoom + 1 : 0;
        });
      }
    };

    Object.entries(discList).forEach(([disc, discAmount]) => { // wir gehen durch ['Erwachsen', '6-14', 'studenten']
      if (disc.split('_')[0] === disc) pushToCart(disc, discAmount);

      const getNothingAge = discAmount - (isInUse[disc] || 0);
      pushToCart(disc, getNothingAge);
    });

    console.log('Cart', { ...newShoppingCart, day: shortDay, time });
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

  const loadPriceData = async () => {
    const priceData: PriceItem[] = await getFireCollection(pricePath, false, [['duration', '==', +duration]]);
    if (priceData) {
      const isThere: ContainsList = { day: [], time: [], discount: [], persons: [] };

      priceData.forEach((x) => {
        if (x?.persons && x.persons !== 1 && !isThere?.persons.includes(x.persons)) isThere.persons.push(x.persons);
        if (x?.day && x?.day !== 'nothing' && !isThere?.day.includes(x.day)) isThere.day.push(x.day);
        if (x?.time && !isThere?.time.includes(x.time)) isThere.time.push(x.time);
        if (x?.discount && isThere?.discount.indexOf(x.discount) === -1) isThere?.discount.push(x.discount);
      });

      setPriceList(priceData);
      setContains(isThere);
    }
  };

  useEffect(() => { if (priceList[0] && contains) createShoppingCart(); }, [contains, discounts]); // Preise werden neu berechnet
  useEffect(() => { loadPriceData(); }, [pricePath]); // init (Preise werden geladen)

  return { shoppingCart, isValid, totalPrice, contains, getAdults };
};

export default useShoppingCart;
