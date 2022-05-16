import { Selected } from '../interfaces/company';

const getQuestFormValue = (day?: string, selected?: Selected, defaultVal?: string[], isFoundation?: true): { list: string[], isRound?: boolean } => {
  console.log('day', day);
  let list: string[] = defaultVal || [];
  let isRound = false;
  if (!selected) return { list };

  selected.values?.forEach((val: { value: any; onDays?: string[]; option?: string; isRound?: boolean; }) => {
    if (selected.name.startsWith('onDay') || isFoundation) {
      if (day && val.onDays?.findIndex((x: string) => day.indexOf(x) !== -1) !== -1) {
        if (isFoundation) {
          list = ['object'];
        } else {
          list.push(val.value);
        }

        if (selected.name === 'onDayDuration' && val.option === 'rundenpreis') isRound = true;
      }
    } else {
      list.push(val.value);
    }
  });
  // const list: string[] = defaultVal || [];
  // let isRound: boolean = false;

  // if (!selected) return { list, isRound };

  // if (selected.values && !isRound) {
  //   if (selected.name.startsWith('onDay')) { // DayValue
  //     selected.values.forEach((currentValue: any) => {
  //       if (currentValue && day && currentValue?.onDays === day) {
  //         if (currentValue.isRound) isRound = true; // es sind runden
  //         if (selected.name === 'onDayObject') {
  //           list.push(currentValue.value.split(','));
  //         } else {
  //           list.push(currentValue.value);
  //         }
  //       }
  //     });
  //   } else if (selected.values?.[0].isRound) {
  //     isRound = true;
  //     list.push(selected.values?.[0].value);
  //   } else {
  //     selected.values.forEach((x) => {
  //       list.push(x.value);
  //     });
  //   }
  // }

  return { list, ...(isRound ? { isRound } : {}) };
};

export default getQuestFormValue;
