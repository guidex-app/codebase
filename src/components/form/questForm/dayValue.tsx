import { FunctionalComponent, h } from 'preact';

import Chip from '../../chip';

interface DayValueProps {
  valueIndex: number;
  values?: string[];
  disabled?: true;
  options: string[];
  addOnDayValue: (days: string[], valueIndex: number) => void;
}

const DayValue: FunctionalComponent<DayValueProps> = ({ valueIndex, values, options, disabled, addOnDayValue }: DayValueProps) => {
  const updateValue = (dayValue: string) => {
    if (disabled) return;
    const newDayValue: string[] = values || [];
    const findValue: number = newDayValue.indexOf(dayValue);

    if (findValue > -1) {
      newDayValue.splice(findValue, 1);
    } else {
      newDayValue.push(dayValue);
    }

    addOnDayValue(newDayValue, valueIndex);
  };

  return (
    <div>
      {options.map((dayName: string) => (!disabled || (values?.includes(dayName))) && (
        <Chip small label={`${dayName}.`} type={values && values.indexOf(dayName) > -1 ? 'active' : 'inactive'} key={dayName} action={() => updateValue(dayName)} />
      ))}
    </div>
  );
};

export default DayValue;
