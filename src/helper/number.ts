// eslint-disable-next-line import/prefer-default-export
export const randomNumber = (min: number, max: number) => (
  Math.floor(Math.random() * (max - min + 1)) + min
);

export const getPerfectNumber = (nr: number): number => Math.round((nr * 10) / 10);
