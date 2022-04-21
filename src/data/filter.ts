import { Cat } from '../interfaces/categorie';
import { Weather } from '../interfaces/user';

const filterCats = (list: any[], filter?: string[], weather?: Weather): any[] => {
  if (!list?.[0] || !weather) return list;

  console.log(weather);

  const { temp: t, shortName: w } = weather;

  const prefixList: { [key: string]: string[] } = {};
  let isRainy: boolean = false; // wenn regen ist

  // create prefixList
  if (filter?.[0]) {
    for (let index = 0; index < filter.length; index += 1) {
      const tag: string = filter[index];
      if (!isRainy && tag === 'we_rainy') isRainy = true;

      const prefix = tag.substring(0, 2);
      if (prefixList[prefix]) {
        prefixList[prefix].push(tag);
      } else {
        prefixList[prefix] = [tag];
      }
    }
  }

  // get guidex weather algorythmus
  if (!prefixList.te && !prefixList.we) {
    if (w === 'Rain') {
      isRainy = true;
      prefixList.we = ['we_rainy', 'lo_indoor'];
    } else {
      if (t >= 20 && w !== 'Mist') prefixList.te = ['te_sommerlaune', 'lo_outdoor'];
      if (t >= 15 && t <= 19) prefixList.te = ['te_nordisch'];
      if (t >= 10 && t <= 14) prefixList.te = ['te_wetterfrei'];
      if (t <= 9) prefixList.te = ['te_frostigefreude'];

      // INDOOR & OUTDOOR
      // Wenn beide möglichenkeiten vorhande sind kann die kategorie immer ausgegeben werden

      // INDOOR
      // Indoor kann immer angezeigt werde naußer bei sommerlaune

      // OUTDOOR
      // Outdoor kann angezeigt werden, wenn es zum wetter passt
      // schwierigkeit bei frostigefreude, wetterfrei und nordisch indoor
      // aktivitäten müssen unabhängig vom wetter angezeigt werden

      // FROSTIGE FREUDE
      // Bei frostige freude kommen unternehmungen in frage die man bei kalten temperaturen machen kann (frostigefreude filter)
      // plus unabhängig vom wetter machen kann (Indoor)
    }
  }

  const currentOrder: number = new Date().getDay();
  const newList: Cat[] = [];

  console.log('prefixList', prefixList);

  for (let i = 0; i < list.length; i += 1) {
    const checkTags = Object.entries(prefixList).every(([currentPrefix, prefixValues]: [string, string[]]) => {
      if (currentPrefix === 'te') {
        if (isRainy || (list[i].filter.includes('lo_indoor') && list[i].filter.includes('lo_outdoor'))) return true;
      }

      console.log('check', { prefixList, filter: list[i].filter });
      return prefixValues.findIndex((tag: string) => list[i].filter.includes(tag)) > -1;
    });

    if (checkTags) {
      if (currentOrder === list[i].sortCount) {
        newList.unshift(list[i]);
      } else {
        newList.push(list[i]);
      }
    }
  }

  return newList;
};

export default filterCats;
