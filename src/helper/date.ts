export const shortDay: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

export const dayIsGreater = (date: number, days: number): boolean => {
  const firstDate = new Date();
  const secondDate = new Date(date);
  const time = days * 60 * 60 * 24 * 1000;
  if ((secondDate.getTime() - firstDate.getTime()) < time) {
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
