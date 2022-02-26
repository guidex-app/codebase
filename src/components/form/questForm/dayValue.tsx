import { FunctionalComponent, h } from 'preact';

import Chip from '../../chip';

interface DayValueProps {
  name: string;
  values: string[];
  position: number;
  updateSelectDay: (day: string, name: string) => void;
  dayGroups: string[];
}

const DayValue: FunctionalComponent<DayValueProps> = ({ name, values, position, dayGroups, updateSelectDay }: DayValueProps) => {
  const updateValue = (dayValue: string) => {
    const newValue: string[] = values?.[position]?.split(',') || [];
    const getIndex = newValue.indexOf(dayValue);
    if (getIndex > -1) {
      newValue.splice(getIndex, 1);
    } else if (values.findIndex((x) => x.indexOf(dayValue) !== -1) === -1) {
      newValue.push(dayValue);
    }
    updateSelectDay(newValue.toString(), name);
  };

  return (
    <div style={{ backgroundColor: 'var(--fourth)67', borderRadius: '10px', margin: '2.5px 0', padding: '0 10px' }}>
      {dayGroups.map((day: string) => (
        <Chip small label={`${day}.`} type={values?.[position]?.indexOf(day) > -1 ? 'active' : 'inactive'} key={day} action={() => updateValue(day)} />
      ))}
    </div>
  );
};

export default DayValue;
