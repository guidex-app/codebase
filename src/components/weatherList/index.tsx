import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import { Calendar } from 'react-feather';

import { generateDateString } from '../../helper/date';
import Item from '../item';

interface LocationProps {
  changeDay: (dayNr: number) => void;
}

const WeatherList: FunctionalComponent<LocationProps> = ({ changeDay }: LocationProps) => {
  const generateDayList = () => {
    const actualDate = new Date();
    const newDates: string[] = [];

    for (let i = 1; i <= 5; i += 1) {
      const newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + i);
      newDates.push(generateDateString(newDate));
    }
    return newDates;
  };

  const [dayList] = useState<string[]>(generateDayList());

  return (
    <Fragment>
      <Item label="Heute" icon={<Calendar />} type="grey" action={() => changeDay(0)} />

      {dayList?.map((day: string, index: number) => (
        <Item label={day} icon={<Calendar />} action={() => changeDay(index + 1)} />
      ))}
    </Fragment>
  );
};

export default WeatherList;
