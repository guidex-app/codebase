import { useEffect, useState } from 'preact/hooks';

import { getFireCollection } from '../data/fire';
import { sumOf } from '../helper/array';
import { isInTimeRange } from '../helper/date';
import { ContainsList, PriceItem, ShoppingCart } from '../interfaces/reservation';

const useShoppingCart = (foundation: 'person' | 'object', duration: string, shortDay: string, isRound: boolean, time: string, amountRooms: number, personAmount: number, discounts: { [key: string]: number }, pricePath: string, roundAmount: number) => {
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [contains, setContains] = useState<ContainsList>();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>();

  const getPrice = (price: number) => (parseFloat(price.toFixed(2)));

  /**
   * Sucht einen passenden Preis, für die angegebenen Paramter.
   */
  const getSinglePrice = (terms: { persons: number, discount: string, roundDiscount: number, day: string }): number => {
    if (!contains) return 0;

    const isAb: { persons: number, roundDiscount: number } = { persons: -1, roundDiscount: -1 };
    const included = { time: false, persons: false, roundDiscount: false, discount: false };
    const checkItems: ['time', 'discount', 'persons', 'roundDiscount'] = ['time', 'discount', 'persons', 'roundDiscount'];
    checkItems.forEach((d) => {
      if (d === 'persons' || d === 'roundDiscount') {
        included[d] = contains[d].findIndex((s) => {
          if (s.toLowerCase().startsWith('für')) return s === `${d === 'persons' ? 'F' : 'f'}ür ${terms.persons}`;
          const getNr: number = +s.split(`${d === 'persons' ? 'A' : 'a'}b `)[1];
          const check = getNr <= terms[d];
          if (check) isAb[d] = getNr;
          return check;
        }) !== -1;
      } else if (d === 'time') {
        included[d] = contains?.time.findIndex((cTime: string) => isInTimeRange(time, cTime)) !== -1;
      } else {
        included[d] = contains?.[d].includes(terms[d]);
      }
    });

    console.log('included', included);
    const findPrice: PriceItem | undefined = priceList.find((item: PriceItem) => {
      if (included.time && !isInTimeRange(time, item.time)) return false;

      const checkList: ['persons', 'discount', 'roundDiscount', 'day'] = ['persons', 'discount', 'roundDiscount', 'day'];
      const defaultValues: any = { day: 'nothing', persons: 'Ab 1', roundDiscount: false, discount: false };

      return checkList.every((v) => {
        if (v === 'persons' && included[v]) return isAb.persons !== -1 ? item[v] === `Ab ${isAb.persons}` : item[v] === `Für ${terms[v]}`;
        if (v === 'roundDiscount' && included[v]) return isAb.roundDiscount !== -1 ? item[v] === `ab ${isAb.roundDiscount}` : item[v] === `für ${terms[v]}`;
        if (v === 'day') return item.day.indexOf(terms.day) !== -1;

        if (included[v]) return item[v] === terms[v];
        return item[v] === defaultValues[v];
      });
    });

    console.log('ITEM', { gefunden: findPrice, gesucht: terms });
    console.log('==============');

    if (!findPrice?.price) return 0;
    if (!isRound) return getPrice(findPrice.price);
    return getPrice(findPrice.price) * roundAmount;
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
    console.log('================');
    console.log('ALLE PREISE', priceList);
    console.log('PREISE BEINHALTEN', contains);

    if (!priceList?.[0]) setStatus('invalid');
    setStatus('loading');

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
          const price = getSinglePrice({ persons: grouSizes[isInRoom], discount, roundDiscount: roundAmount, day: shortDay });
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

    if (arePricesValid(newShoppingCart)) {
      setShoppingCart(newShoppingCart);
      if (foundation === 'person') {
        setTotalPrice(getPrice(newShoppingCart.reduce((prev, cur) => prev + (cur.price * cur.amount), 0)));
      } else {
        setTotalPrice(getPrice(newShoppingCart.reduce((prev, cur) => prev + (cur.price * 1), 0)));
      }

      return setStatus('valid');
    }
    setStatus('invalid');
  };

  const loadPriceData = async () => {
    const priceData: PriceItem[] | undefined = await getFireCollection(pricePath, false, [['duration', '==', parseInt(duration, 10)]]);
    if (priceData) {
      const containsList: ContainsList = { time: [], discount: [], persons: [], roundDiscount: [] };

      priceData.forEach((price: PriceItem) => {
        if (price.day.indexOf(shortDay) !== -1) {
          const specList: ['time', 'discount', 'roundDiscount', 'persons'] = ['time', 'discount', 'roundDiscount', 'persons'];

          specList.forEach((spec: 'time' | 'discount' | 'roundDiscount' | 'persons') => {
            const specValue: string | number = price[spec] || '';
            const checkTime: boolean = !price.time || isInTimeRange(time, price.time);

            if (!specValue || !checkTime || containsList[spec].includes(specValue)) return;
            if ((spec === 'roundDiscount' || spec === 'persons') && specValue.toLowerCase().startsWith('für')) {
              return containsList[spec].unshift(specValue);
            }

            return containsList[spec].push(specValue);
          });
        }
      });

      containsList.persons.sort().reverse();
      containsList.roundDiscount.sort().reverse();

      setPriceList(priceData);
      setContains(containsList);
    }
  };

  useEffect(() => { if (priceList[0] && contains) createShoppingCart(); }, [contains, discounts]); // Preise werden neu berechnet
  useEffect(() => { loadPriceData(); }, [pricePath]); // init (Preise werden geladen)

  return { shoppingCart, status, totalPrice, contains, getAdults };
};

export default useShoppingCart;
