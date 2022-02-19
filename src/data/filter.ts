import { Cat } from '../interfaces/categorie';
import { Weather } from '../interfaces/user';

const filterCats = (list: any[], filter?: string[], weather?: Weather): any[] => {
  if (!list || !filter || !weather || list.length === 0) return list;

  const prefixList: { [key: string]: string[] } = {};
  let isRainy: boolean = false;

  const { temp: t, shortName: w } = weather;

  // create prefixList
  for (let index = 0; index < filter.length; index += 1) {
    const filterItem = filter[index];
    if (filterItem === 'we_rainy') isRainy = true;

    const prefix = filterItem.substring(0, 2);
    if (prefixList[prefix]) {
      prefixList[prefix].push(filterItem);
    } else {
      prefixList[prefix] = [filterItem];
    }
  }

  // guidex algorythmus
  if (!prefixList.te && !prefixList.we) {
    if (w !== 'Rain') {
      if (t >= 20 && w !== 'Mist') prefixList.te = ['te_sommerlaune'];
      if (t >= 15 && t <= 19) prefixList.te = ['te_nordisch'];
      if (t >= 10 && t <= 14) prefixList.te = ['te_wetterfrei'];
      if (t <= 9) prefixList.te = ['te_frostigefreude'];
    } else {
      isRainy = true;
      prefixList.we = ['we_rainy'];
    }
  }

  console.log('Wird gefiltert', prefixList);

  return list.filter((cat: Cat) => (
    Object.values(prefixList).every((prefix: string[]) => (
      (isRainy && prefix[0].startsWith('te')) || prefix.findIndex((pr: string) => cat.filter.indexOf(pr) > -1) > -1
    ))
  ));
};

export default filterCats;
