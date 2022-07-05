import { IconCalendar } from '@tabler/icons';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { getCurrentShortname, getSimpleDateString } from '../../../helper/date';
import style from './style.module.css';

interface DaySliderProps {
    change: (value: any, key: string) => void,
    name: string;
    openedDays: string[];
    value?: string;

    error?: 'invalid' | 'error' | 'valid';
}

const DaySlider: FunctionalComponent<DaySliderProps> = ({ name, change, openedDays, value, error }: DaySliderProps) => {
  const [dayList, setDayList] = useState<[string, number, string][]>();

  const newValue = (day: string) => {
    console.log(day);
    return change(day, name);
  };

  const addHoursToDate = (numberOfMlSeconds: number, intHours: number): Date => {
    const addMlSeconds = (intHours * 60) * 60000;
    const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);

    return newDateObj;
  };

  const generateDayList = () => {
    const currentDate: number = new Date().getTime();
    const newDayList: [string, number, string][] = [0, 24, 48, 62, 86, 110, 134].map((d: number) => {
      const getDate = addHoursToDate(currentDate, d);
      return [getCurrentShortname(getDate.getDay()), getDate.getDate(), getSimpleDateString(getDate)];
    });
    setDayList(newDayList);
  };

  useEffect(() => {
    generateDayList();
  }, []);

  return (
    <Fragment>
      {dayList && (
      <div class={style.daySlider}>
        {dayList.map((day: [string, number, string], dayIndex: number) => (
          <button onClick={() => newValue(day[2])} disabled={!openedDays.includes(day[0])} type="button" class={value === day[2] ? style.today : undefined}>{day[1]}<strong>{dayIndex === 0 ? 'Heute' : day[0]}</strong></button>
        ))}
        <button type="button"><IconCalendar /><strong>Kalender</strong></button>
      </div>
      )}

      {error === 'error' && <small class={style.errorMessage}>Bitte mache eine korrekte eingabe</small>}
    </Fragment>
  );
};

export default DaySlider;
