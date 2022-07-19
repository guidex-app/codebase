import { Selected, SelectedValues, ServiceField } from '../interfaces/company';

export const getQuestFormList = (day?: string, selected?: Selected, defaultVal?: string[], isFoundation?: true): { list: string[], isRound?: boolean } => {
  let list: string[] = defaultVal || [];
  let isRound = false;
  if (!selected) return { list };

  // Lösung 1: eine zusätzliche liste ersten, die für jeden Index zurückgibt ob es gruppe oder pro person ist
  // Lösung 2: wir geben eine Map zurück die den value und die jeiligen personen infos zurückgibt
  // Lösung 3: eigene funktion

  selected.values?.forEach((val: { value: any; onDays?: string[]; option?: string; isRound?: boolean; }) => {
    if (selected.name.startsWith('onDay') || isFoundation) {
      if (day && val.onDays?.findIndex((x: string) => day.indexOf(x) !== -1) !== -1) {
        if (isFoundation) {
          list = ['object'];
        } else if (selected.name === 'onDayGroup') {
          list.push(`${val.option === 'fuer' ? 'Für' : 'Ab'} ${val.value}`);
        } else if (selected.name === 'onDayRoundDiscount') {
          list.push(`${val.option === 'fuer' ? 'für' : 'ab'} ${val.value}`);
        } else {
          list.push(val.value);
        }

        if (selected.name === 'onDayDuration' && val.option === 'dauer_pro_runde') isRound = true;
      }
    } else {
      console.log(selected.name);
      if (selected.name === 'person') {
        list.push(`${val.option === 'fuer' ? 'Für' : 'Ab'} ${val.value}`);
      } else if (selected.name === 'roundDiscount') {
        list.push(`${val.option === 'fuer' ? 'für' : 'ab'} ${val.value}`);
      } else {
        list.push(val.value);
      }
    }
  });

  return { list, ...(isRound ? { isRound } : {}) };
};

const getValPrefix = (structureID: string, val: string, option?: string): string => {
  if (!['persons', 'duration', 'roundDiscount'].includes(structureID)) return val;
  if (!option) return '';
  if (structureID === 'persons') return option === 'fuer' ? 'Für' : 'Ab';
  const newPrefix = option === 'fuer' ? 'für' : 'ab';
  return `${newPrefix ? `${newPrefix} ` : ''}${val}`;
};

export const getStructureValues = (structureID: string, day: string, values?: SelectedValues[]): string[] => {
  const defaults: { [key: string]: string[] } = { discounts: [''], time: [''], age: [], persons: ['Ab 1'], foundation: ['person'] };

  let list: string[] = [...(defaults[structureID] || [])];
  values?.forEach((val: SelectedValues) => {
    if (val.onDays?.[0] && val.onDays?.findIndex((g: string) => day.indexOf(g) === -1) !== -1) return;
    if (structureID === 'foundation') { list = ['object']; return; }
    if (structureID === 'duration' && val.option === 'dauer_pro_runde') { list.push('isRound'); }
    const newValue = getValPrefix(structureID, val.value, val.option);
    if (newValue) list.push(newValue);
  });
  return list;
};

export const getQuestFormData = (day: string, structure: ServiceField[], structureIDs: string[]): { [key: string]: string[] } => {
  const values: { [key: string]: string[] } = {};
  structure.forEach((d: ServiceField) => {
    if (!structureIDs.includes(d.name)) return;
    const getValues = getStructureValues(d.name, day, d.selected?.values);
    if (getValues[0] === 'isRound') {
      values.durationType = ['isRound'];
      getValues.shift();
    }
    values[d.name] = getValues;
  });

  return values;
};
