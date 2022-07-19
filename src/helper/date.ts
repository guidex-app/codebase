export const shortDay: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

export const getCurrentShortname = (dayNr?: number): 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So' => {
  const currentDayNr: number = dayNr !== undefined ? dayNr : new Date().getDay();
  console.log(currentDayNr);
  return shortDay[currentDayNr === 0 ? 6 : currentDayNr - 1];
};

export const generateDateString = (from: Date): string => {
  const options: any = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
  return from.toLocaleDateString('de-DE', options);
};

/**
 * True, wenn heute + angegebene tage kleiner als der zu vergleichende Tag ist.
 */
export const isUpToDate = (day: string): boolean => (
  day === generateDateString(new Date())
);

export const getSimpleDateString = (date: Date) => {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();

  if (month.length < 2) { month = `0${month}`; }
  if (day.length < 2) { day = `0${day}`; }

  return `${year}-${month}-${day}`;
};

export const isInTimeRange = (timeToCompare: string, timeRange: string | false): boolean => {
  if (!timeRange) return false;
  const timeSplitted = timeRange.split('-');
  if (timeSplitted[1] === '00:00') timeSplitted[1] = '24:00';
  return timeSplitted && (timeToCompare >= timeSplitted[0] && timeToCompare <= timeSplitted[1]);
};
