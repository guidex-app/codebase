import { AnsDB } from '../interfaces/company';

const getQuestFormValue = (day?: string, answers?: AnsDB[], defaultVal?: string[]): { list: string[], isRound?: boolean } => {
  let list: string[] = defaultVal || [];
  let isRound: boolean = false;

  if (!answers) return { list, isRound };

  const findOnDayIndex = (onDays?: (string | undefined)[]): number[] => {
    if (!onDays || !day || day === 'nothing') return [];

    const indexList: number[] = [];
    onDays.forEach((dayName: (string | undefined), onDayIndex: number) => {
      if (dayName && dayName.indexOf(day) > -1) indexList.push(onDayIndex);
    });

    return indexList;
  };

  answers.forEach((ans: AnsDB) => {
    if (ans.values && !isRound) {
      if (ans.name.startsWith('onDay')) { // DayValue
        const dayIndexList: number[] = findOnDayIndex(ans.onDays);
        dayIndexList.forEach((indexValue: number) => {
          const currentValue: any = ans.values?.[indexValue];

          if (currentValue) {
            if (ans.isRound?.[indexValue]) isRound = true; // es sind runden
            if (ans.name === 'onDayObject') {
              list.push(currentValue.split(','));
            } else {
              list.push(currentValue);
            }
          }
        });
      } else if (ans.isRound?.[0]) {
        isRound = true;
        list.push(ans.values?.[0]);
      } else {
        list = [...list, ...ans.values];
      }
    }
  });

  return { list, isRound };
};

export default getQuestFormValue;
