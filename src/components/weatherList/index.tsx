import { Fragment, FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Calendar } from 'react-feather';
import { generateDateString } from '../../helper/date';
import Item from '../item';

interface LocationProps {

}

const WeatherList: FunctionalComponent<LocationProps> = () => {
  const [dayList, setDayList] = useState<string[]>();

  const generateDayList = () => {
    const actualDate = new Date();
    const newDates: string[] = [];

    for (let i = 1; i <= 5; i += 1) {
      const newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + i);
      newDates.push(generateDateString(newDate));
    }
    setDayList(newDates);
  };

  useEffect(() => {
    generateDayList();
  }, []);

  return (
    <Fragment>
      <Item label="Heute" icon={<Calendar />} type="grey" />

      {dayList?.map((day: string) => (
        <Item label={day} icon={<Calendar />} />
      ))}
    </Fragment>
  );
};

export default WeatherList;
