/**
 * Returnt true wenn es die gleichen Arrays sind
 */
export const sameArrCheck = (arr1: any[], arr2: any[]) => (
  arr1.length === arr2.length && arr1.every((item: any[], index) => (
    item === arr2[index]
  ))
);

export const removeDuplicated = (arr: any[]) => arr.filter((item, index) => arr.indexOf(item) === index);

export const arrayIsEqual = (arr: any[]) => (
  arr.every((item) => item === arr[0])
);

export const sumOf = (num: number[]): number => (
  num.reduce((a, b) => a + b, 0)
);

export const randomNumber = (min: number, max: number) => (
  Math.floor(Math.random() * (max - min + 1)) + min
);

export const mergeUnique = (arr1: string[], arr2?: any[]): string[] => {
  if (arr2 && arr2.length > 0) {
    return arr1.concat(arr2?.filter((item: any) => (
      !!item && arr1.indexOf(item) === -1
    )));
  }
  return arr1;
};
