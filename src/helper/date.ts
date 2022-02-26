export const shortDay: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
export const dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

/** gibt true zurück wenn heute größer als der angegebene Tag ist  */
export const isDayGreater = (date: number, days: number): boolean => {
  const today = new Date(); // heute
  const toCompare = new Date(date);
  const time = days * 60 * 60 * 24 * 1000;
  if ((toCompare.getTime() - today.getTime()) < time) {
    return false;
  }
  return true;
};

export const generateDateString = (from: Date): string => {
  const options: any = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
  return from.toLocaleDateString('de-DE', options);
};

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
