/* eslint-disable no-nested-ternary */
import { FunctionalComponent, h } from 'preact';
import Chip from '../../chip';

interface DayPickerProps {
  name: string;
  values?: string[];
  position: number;
  change: (days: string, name: string) => void;
  openings?: (string | false)[];
}

const DayPicker: FunctionalComponent<DayPickerProps> = ({ name, values, position, openings, change }: DayPickerProps) => {
  const dayNames = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];

  const updateValue = (dayValue: string) => {
    const value: string[] = values?.[position]?.split(',') || [];
    const getIndex = value.indexOf(dayValue);
    const isEmpty = !values || values?.findIndex((x) => x && x.indexOf(dayValue) !== -1) === -1;
    console.log(isEmpty);
    const newValue: string[] = [];
    console.log(dayValue);
    dayNames.forEach((day) => {
      const addRemove = getIndex > -1 ? undefined : (isEmpty ? day : undefined);
      const newDay = day === dayValue ? addRemove : (value.indexOf(day) !== -1 ? day : undefined);
      if (newDay) newValue.push(newDay);
    });
    console.log('arr', newValue);
    change(newValue.toString(), name);
  };

  return (
    <div className="ion-no-padding ion-text-center" style={{ backgroundColor: '#2b303d', borderRadius: '10px', margin: '2.5px 0', padding: '0 10px' }}>
      {dayNames.map((day: string, index: number) => openings?.[index] && (
        <Chip small label={`${day}.`} type={values?.[position] && values?.[position].indexOf(day) > -1 ? 'active' : 'inactive'} key={day} action={() => updateValue(day)} />
      ))}
    </div>
  );
};

export default DayPicker;
