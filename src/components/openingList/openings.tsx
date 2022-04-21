import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { isInTimeRange, shortDay } from '../../helper/date';
import style from './style.module.css';

interface OpeningListProp { openings?: (string | false)[]; day?: number }

const OpeningList: FunctionalComponent<OpeningListProp> = ({ openings, day }: OpeningListProp) => {
  const [list, setList] = useState<[string, string][]>([['', ''], ['', ''], ['', ' ']]);
  const [today, setToday] = useState<[boolean, string] | undefined>();

  const getTodayOpeningsText = (currenOpenings: (string | false)) => {
    if (!currenOpenings) return setToday([false, 'ist Geschlossen']);

    const currentDate = day ? new Date(day) : new Date();
    const currentTime: string = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const [startTime, endTime] = currenOpenings.split('-');
    const isOpen = isInTimeRange(currentTime, currenOpenings);

    setToday(isOpen ? [true, `Schließt um ${endTime}`] : [false, `Öffnet um ${startTime}`]);
  };

  const generateOpenings = () => {
    const currentDayNr = day ? new Date(day).getDay() : new Date().getDay();
    const newList: [string, string][] = [];

    openings?.forEach((x: (string | false), dayIndex: number) => {
      if (dayIndex === currentDayNr) getTodayOpeningsText(x);
      const lastItem = newList[newList.length - 1];
      if (dayIndex === 0 || (lastItem[1] !== x)) return newList.push([shortDay[dayIndex], x || 'Geschlossen']);
      if (openings[dayIndex + 1] !== x) return newList.splice(newList.length - 1, 1, [`${lastItem[0]} - ${shortDay[dayIndex]}`, lastItem[1]]);
    });

    setList(newList);
  };

  useEffect(() => { if (openings) generateOpenings(); }, [openings]);

  return (
    <div class={style.openings}>
      {today && <div style={{ color: 'var(--fifth)' }}><strong style={{ color: today[0] ? 'var(--green)' : 'var(--red)' }}>{`${day ? shortDay[new Date(day).getDay()] : 'Heute'}, `}{today[0] ? 'Geöffnet' : 'Geschlossen'}</strong> ⋅ {today[1]}</div>}
      {list?.map((days: [string, string]) => <div><strong>{days[0] ? `${days[0]}:` : ''}&nbsp;</strong>{days[1]}</div>)}

      <div style={{ color: 'var(--red)' }}>
        Feiertage und Sonder&shy;öffnungszeiten
      </div>
    </div>
  );
};

export default OpeningList;
