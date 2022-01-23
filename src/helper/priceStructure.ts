import { AnsDB } from '../interfaces/company';

const getQuestFormValue = (day?: string, answers?: AnsDB[], defaultVal?: string[]): { list: string[], isRound?: boolean } => {
  let list: string[] = defaultVal || [];
  let isRound: boolean = false;

  if (answers) {
    const findOnDayIndex = (onDays: (string | undefined)[]): number[] => {
      const validIndexList: number[] = [];

      onDays?.forEach((dayName: (string | undefined), onDayIndex: number) => {
        if (day && dayName && dayName.indexOf(day) > -1) validIndexList.push(onDayIndex);
      });

      return validIndexList;
    };

    answers.forEach((element: AnsDB) => {
      if (element.values && !isRound) {
        if (element.name.startsWith('onDay')) { // DayValue
          const onDaysIndexes: number[] = element.onDays ? findOnDayIndex(element.onDays) : [];
          onDaysIndexes.forEach((indexValue: number) => {
            if (element.values?.[indexValue]) {
              if (element.isRound?.[indexValue]) isRound = true; // es sind runden
              if (element.name === 'durationGroup') {
                list.push(...(element.values?.[indexValue].split(',') || []));
              } else {
                list.push(element.values?.[indexValue]);
              }
            }
          });
        } else if (element.isRound?.[0]) {
          isRound = true;
          list.push(element.values?.[0]);
        } else {
          list = [...list, ...element.values];
        }
      }
    });
  }

  return { list, isRound };
};

export default getQuestFormValue;
