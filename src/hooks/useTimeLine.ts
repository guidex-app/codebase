import { useEffect, useState } from 'preact/hooks';

/**
   * Fügt einer Startzeit eine Duration hinzu.
   */
export const calculateTime = (startTime: string, addDuration: string): string => {
  const timeArray: string[] = startTime.split(':'); // [01, 00]

  const oldHour: number = parseInt(timeArray[0], 10); // 1
  const minutes: string | number = parseInt(timeArray[1], 10); // 00

  const durationTime = parseInt(addDuration, 10); // 60

  const addHourNr: number = Math.ceil(durationTime / 60) - 1; // (60 / 60) - 1 = 0
  const newMinutes = durationTime + minutes - (addHourNr * 60); // 60 + 0 - (0) = 60

  const newHours = newMinutes >= 60 ? addHourNr + 1 + oldHour : addHourNr + oldHour; // 1 + 1 + 1 = 3

  const correctHour = `${newHours < 10 ? `0${newHours}` : newHours}`; // 03
  const correctMin = newMinutes >= 60 ? newMinutes - 60 : newMinutes; // 63 - 60 = 3

  const newTime = `${correctHour}:${correctMin < 10 ? `0${correctMin}` : correctMin}`; // 03:03

  return newTime;
};

const useTimeLine = (duration: number, openings?: (string | false)[]): string[] => {
  const [timeLine, setTimeline] = useState<string[]>([]);

  /**
  * Generiert eine Uhrzeit. Es werden alle Öffnungszeiten überprüft und die früheste und späteste Zeit gewählt.
  */
  const overAllTime = (): string[] => {
    if (openings) {
      let [from, until] = ['99:99', '00:00'];
      Object.values(openings).forEach((element: (string | false)) => {
        const [nFrom, nUntil] = (element && element.split('-')) || [];
        if (nFrom < from) from = nFrom;
        if (nUntil > until) until = nUntil;
      });
      return [from, until];
    }
    return [];
  };

  const getTimeLine = () => {
    if (openings) {
      const startEndTime: string[] = overAllTime();
      const startTime: string = startEndTime[0];
      const endTime: string = startEndTime[1];
      const newTimeLine = [startTime];
      const newGap = duration || 30;

      for (let index = newGap; calculateTime(startTime, index.toString()) <= endTime; index += newGap) {
        newTimeLine.push(calculateTime(startTime, index.toString()));
      }

      setTimeline(newTimeLine);
    }
  };

  useEffect(() => {
    getTimeLine();
  }, []);

  return timeLine;
};

export default useTimeLine;
