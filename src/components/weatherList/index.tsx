import { IconCalendar } from '@tabler/icons';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import { generateDateString } from '../../helper/date';
import Item from '../item';

interface LocationProps {
  changeDay: (dateString: string) => void;
}

const WeatherList: FunctionalComponent<LocationProps> = ({ changeDay }: LocationProps) => {
  const generateDayList = () => {
    const actualDate = new Date();
    const newDates: string[] = [];

    for (let i = 0; i <= 5; i += 1) {
      const newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + i);
      newDates.push(generateDateString(newDate));
    }
    return newDates;
  };

  const [dayList] = useState<string[]>(generateDayList());

  const dayNames = ['Heute', 'Morgen'];

  return (
    <div>
      {dayList?.map((day: string, index: number) => (
        <Item label={dayNames[index] || day} icon={<IconCalendar />} type={index === 0 ? 'grey' : undefined} action={() => changeDay(dayNames[index] || day)} />
      ))}
    </div>
  );
};

export default WeatherList;
