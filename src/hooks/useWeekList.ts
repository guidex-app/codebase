import { useState } from 'preact/hooks';
import { generateDateString } from '../helper/date';

const useWeekList = (): { weekList: string[], getWeekList: (date: Date) => void } => {
  const [weekList, setWeekList] = useState<string[]>([]);

  const increaseDate = (startDate: Date, amount: number) => new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * amount);

  const getWeekList = (startDate: Date) => {
    if (startDate) {
      const newTimeLine: string[] = [];
      for (let index = 0; index < 7; index += 1) {
        const getDate = increaseDate(startDate, index);
        newTimeLine.push(generateDateString(getDate));
      }
      setWeekList(newTimeLine);
    }
  };

  return { weekList, getWeekList };
};

export default useWeekList;
