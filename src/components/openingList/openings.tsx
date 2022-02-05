import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { shortDay } from '../../helper/date';
import style from './style.module.css';

interface OpeningListProp {
    openings?: (string | false)[];
}

const OpeningList: FunctionalComponent<OpeningListProp> = ({ openings }: OpeningListProp) => {
  const [list, setList] = useState<[string, string][]>([['Mo - So', 'Geschlossen']]);

  const generateOpenings = () => {
    const newList: [string, string][] = [];

    openings?.forEach((x: (string | false), dayIndex: number) => {
      const lastItem = newList[newList.length - 1];
      if (dayIndex === 0 || (lastItem[1] !== x)) return newList.push([shortDay[dayIndex], x || 'Geschlossen']);
      if (openings[dayIndex + 1] !== x) return newList.splice(newList.length - 1, 1, [`${lastItem[0]} - ${shortDay[dayIndex]}`, lastItem[1]]);
    });

    setList(newList);
  };

  useEffect(() => {
    if (openings) generateOpenings();
  }, [openings]);

  return (
    <table class={style.openings}>
      <tr>
        {list?.map((day: [string, string]) => <td><strong>{day[0]}:</strong> {day[1]}</td>)}
      </tr>
      <tr class="red">
        <td colSpan={list.length}>Feiertage und Sonder&shy;öffnungszeiten </td>
      </tr>
    </table>
  );
};

export default OpeningList;
