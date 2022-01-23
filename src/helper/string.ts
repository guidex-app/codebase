// eslint-disable-next-line import/prefer-default-export
export const replaceSpecialCharacters = (str: string) => {
  const umlautMap:any = { ü: 'ue', ä: 'ae', ö: 'oe', ß: 'ss' };
  return str
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '')
    .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
      const big:any = umlautMap[a.slice(0, 1)];
      return big.charAt(0) + big.charAt(1) + a.slice(1);
    })
    .replace(/ /g, '_')
    .replace(
      new RegExp(`[${Object.keys(umlautMap).join('|')}]`, 'g'),
      (a) => umlautMap[a],
    );
};
