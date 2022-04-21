import { AnsDB } from '../interfaces/company';

const getQuestFormValue = (day?: string, selected?: AnsDB, defaultVal?: string[]): { list: string[], isRound?: boolean } => {
  let list: string[] = defaultVal || [];
  let isRound: boolean = false;

  if (!selected) return { list, isRound };

  const findOnDayIndex = (onDays?: (string | undefined)[]): number[] => {
    if (!onDays || !day || day === 'nothing') return [];

    const indexList: number[] = [];
    onDays.forEach((dayName: (string | undefined), onDayIndex: number) => {
      if (dayName && dayName.indexOf(day) > -1) indexList.push(onDayIndex);
    });

    return indexList;
  };

  if (selected.values && !isRound) {
    if (selected.name.startsWith('onDay')) { // DayValue
      const dayIndexList: number[] = findOnDayIndex(selected.onDays);
      dayIndexList.forEach((indexValue: number) => {
        const currentValue: any = selected.values?.[indexValue];

        if (currentValue) {
          if (selected.isRound?.[indexValue]) isRound = true; // es sind runden
          if (selected.name === 'onDayObject') {
            list.push(currentValue.split(','));
          } else {
            list.push(currentValue);
          }
        }
      });
    } else if (selected.isRound?.[0]) {
      isRound = true;
      list.push(selected.values?.[0]);
    } else {
      list = [...list, ...selected.values];
    }
  }

  return { list, isRound };
};

export default getQuestFormValue;
