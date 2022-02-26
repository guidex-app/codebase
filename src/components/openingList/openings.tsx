import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { isInTimeRange, shortDay } from '../../helper/date';
import style from './style.module.css';

interface OpeningListProp { openings?: (string | false)[]; }

const OpeningList: FunctionalComponent<OpeningListProp> = ({ openings }: OpeningListProp) => {
  const [list, setList] = useState<[string, string][]>([['', ''], ['', ''], ['', ' ']]);
  const [today, setToday] = useState<[boolean, string] | undefined>();

  const getTodayOpeningsText = (currenOpenings: (string | false)) => {
    if (!currenOpenings) return setToday([false, 'Heute ist Geschlossen']);

    const currentDate = new Date();
    const currentTime: string = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const [startTime, endTime] = currenOpenings.split('-');
    const isOpen = isInTimeRange(currentTime, currenOpenings);

    setToday(isOpen ? [true, `Schließt um ${endTime}`] : [false, `Öffnet um ${startTime}`]);
  };

  const generateOpenings = () => {
    const currentDayNr = new Date().getDay();
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
      {today && <div style={{ color: 'var(--fifth)' }}><strong style={{ color: 'var(--green)' }}>{today[0] ? 'Geöffnet' : 'Geschlossen'}</strong> ⋅ {today[1]}</div>}
      {list?.map((day: [string, string]) => <div class={day[1] === 'Geschlossen' ? 'red' : 'green'}><strong>{day[0] ? `${day[0]}:` : ''}&nbsp;</strong>{day[1]}</div>)}

      <div style={{ color: 'var(--red)' }}>
        Feiertage und Sonder&shy;öffnungszeiten
      </div>
    </div>
  );
};

export default OpeningList;
