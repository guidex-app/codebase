import { useState, useEffect } from 'preact/hooks';
import { PriceTerms, IncludedPriceSpecs, ShoppingCart, UserPreferences } from '../interfaces/reservation';
import { getFireCollection } from '../data/fire';
import { shortDay } from '../helper/date';

const useShoppingCart = (foundation: 'persPrice' | 'objectPrice', duration: string, isRound: boolean, dayIndex: number, reservationTime: string, amountRooms: number, personAmount: number, userPreferences: UserPreferences, serviceId?: string) => {
  const [priceList, setPriceList] = useState<PriceTerms[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isValid, setIsValid] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [priceSpecs, setPriceSpecs] = useState<IncludedPriceSpecs>();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>();

  /**
   * Generiert die DurationID
   * Wenn es Runde ist, wird zuerst gecheck ob rundenrabatte vorhanden sind,
   * sonst wird der Preis für eine Runde genommen.
   */
  const persDurationID = (amountPers: number, durationOrRound: number): string => `_${amountPers}_${durationOrRound}`;
  const getPrice = (price: number) => (isRound ? price * parseInt(duration, 10) : price);

  /**
   * Holt sich den korrekten Preis, unter berücksichtigung von rundenrabatt und personen rabatt
   */
  const calculateCorrectPrice = (persons: number, price?: { [key: string]: number }): number => {
    const nDuration = parseInt(duration, 10);

    const durationPrice: number | undefined = price?.[persDurationID(persons, nDuration)] || price?.[persDurationID(1, nDuration)];
    if (durationPrice) return getPrice(durationPrice);

    const personPrice: number | undefined = price?.[persDurationID(persons, 1)] || price?.[persDurationID(1, 1)];
    return personPrice ? getPrice(personPrice) : 0;
  };

  /**
   * Sucht einen passenden Preis, für die angegebenen Paramter.
   */
  const findRightPrice = (persons: number, age: string, discount?: string, prices?: PriceTerms[]) => {
    const getPrices = prices || priceList;

    const findPrice = getPrices.find((i: PriceTerms) => {
      const dayCheck = priceSpecs?.dayGroups.length === 0 || i.dayGroup?.indexOf(shortDay[dayIndex]) !== -1;
      const timeSplitted = i.time?.split('-');
      const timeCompare = timeSplitted && reservationTime >= timeSplitted[0] && reservationTime <= timeSplitted[1];
      const timeCheck = !i.time || timeCompare;
      const ageCheck = (age === 'Erwachsene' && !i.age) || i.age === age;
      const discountCheck = (!discount && !i.discount) || discount === i.discount;

      return timeCheck && ageCheck && discountCheck && dayCheck;
    });

    return calculateCorrectPrice(persons, findPrice?.persDuration);
  };

  /**
   * [12, 11] wir erstellen die gruppengrößen (für den möglichen gruppenrabatt)
   */
  const createPersonGroups = (maxPersons: number): number[] => {
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
    const newPrf = prf || userPreferences.ages;
    return personAmount - (newPrf ? Object.values(newPrf).reduce((a, b) => a + b, 0) : 0);
  };

  /**
     * Es wird ein Shoppingcart erstellt, welcher für alle angegebenen
     * Personen den Preis berechnet, dabei wird rücksicht auf jegliche
     * Art Rabatt genommen.
     * (für alle gleich: runden, dauer, uhrzeit, tag
     * unterschiedlich: discount, alter, personen)
     */
  const createShoppingCart = () => {
    const adultsNr: number = getAdults(userPreferences.ages);
    const otherAgesAreThere: boolean = !!(personAmount !== adultsNr && userPreferences.ages && priceSpecs?.ages.length !== 0); // wenn nicht alles erwachsene sind und noch andere ages definiert sind
    const createAges: { [key: string]: number } = otherAgesAreThere ? { ...userPreferences.ages, Erwachsene: adultsNr } : { Erwachsene: personAmount };

    const newShoppingCart: ShoppingCart[] = [];
    const allDiscounts: [string, number][] = Object.entries(userPreferences.discountName || {});
    const personGroups = createPersonGroups(personAmount);
    const isInUse: { [key: string]: number } = {};
    let isInRoom = 0;

    const pushToCart = (age: string, amount: number, discount?: string) => {
      if (amount >= 1) {
        isInUse[age] = (isInUse[age] || 0) + amount;

        const groupDiscount = createPersonGroups(amount);
        groupDiscount.forEach((element) => {
          const price = findRightPrice(personGroups[isInRoom], age, discount, priceList) || 0;
          newShoppingCart.push({ age, ...(discount && { discount }), amount: element, groupDiscount: personGroups[isInRoom], room: isInRoom + 1, price });
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

    setShoppingCart(newShoppingCart);
  };

  const checkIfPriceIsValid = () => {
    if (shoppingCart) {
      const isPriceValid = shoppingCart.findIndex((x) => x.price === 0) === -1;
      setIsValid(isPriceValid ? 'valid' : 'invalid');
      console.log('shoppingCart', shoppingCart);
      if (isPriceValid) {
        if (foundation === 'persPrice') setTotalPrice(shoppingCart.reduce((prev, cur) => prev + (cur.price * cur.amount), 0));
        if (foundation === 'objectPrice') setTotalPrice(shoppingCart.reduce((prev, cur) => prev + (cur.price * 1), 0));
      }
    }
  };

  useEffect(() => {
    getFireCollection(`services/${serviceId}/prices`, false).then((priceData: PriceTerms[]) => {
      if (priceData) {
        const newPriceSpecs: IncludedPriceSpecs = {
          dayGroups: [],
          times: [],
          discounts: [],
          ages: [],
        };

        priceData.forEach((x) => {
          if (x?.dayGroup && x?.dayGroup !== 'not' && priceSpecs?.dayGroups.indexOf(x.dayGroup) === -1) priceSpecs.dayGroups.push(x.dayGroup);
          if (x?.discount && priceSpecs?.discounts.indexOf(x.discount) === -1) priceSpecs?.discounts.push(x.discount);
          if (x?.age && priceSpecs?.ages.indexOf(x.age) === -1) priceSpecs?.ages.push(x.age);
        });

        setPriceList(priceData);
        setPriceSpecs(newPriceSpecs);
      }
    });
  }, [serviceId]);

  useEffect(() => {
    if (priceList.length > 0) createShoppingCart();
  }, [userPreferences, priceSpecs]);

  useEffect(() => {
    setIsValid('loading');
    checkIfPriceIsValid();
  }, [shoppingCart]);

  return { shoppingCart, isValid, totalPrice, priceSpecs, getAdults };
};

export default useShoppingCart;
