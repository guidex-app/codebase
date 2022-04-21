import { FunctionalComponent, h } from 'preact';

import Chip from '../../chip';

interface DayValueProps {
  valueIndex: number;
  days?: string[];
  values?: string;
  onlySingle?: true;
  addOnDayValue: (days: string, valueIndex: number) => void;
}

const DayValue: FunctionalComponent<DayValueProps> = ({ valueIndex, values, days, addOnDayValue, onlySingle }: DayValueProps) => {
  const updateValue = (dayValue: string) => {
    if (onlySingle) return addOnDayValue(dayValue, valueIndex);

    const newDayValue: string[] = values?.split('+') || [];
    const findValue: number = newDayValue.indexOf(dayValue);

    if (findValue > -1) {
      newDayValue.splice(findValue, 1);
    } else {
      newDayValue.push(dayValue);
    }

    addOnDayValue(newDayValue.join('+'), valueIndex);
  };

  return (
    <div>
      {days && days?.map((dayName: string) => (
        <Chip small label={`${dayName}.`} type={values && values.indexOf(dayName) > -1 ? 'active' : 'inactive'} key={dayName} action={() => updateValue(dayName)} />
      ))}
    </div>
  );
};

export default DayValue;
