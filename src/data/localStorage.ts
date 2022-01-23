import { User } from '../interfaces/user';

const getKey = (key: string) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) return saved;
  }
  return undefined;
};

// eslint-disable-next-line import/prefer-default-export
export const getStorageKeys = async (keys: (keyof User)[]): Promise<User> => {
  const getKeys: any[] = await Promise.all(keys.map(async (key) => getKey(key)));
  const parserKeys: (keyof User)[] = ['location', 'weather'];
  const formatKeys: User = {};

  for (let index = 0; index < keys.length; index += 1) {
    if (getKeys[index] !== undefined) {
      const isParserKey: boolean = parserKeys.includes(keys[index]);
      const value = getKeys[index];
      formatKeys[keys[index]] = isParserKey ? JSON.parse(value) : value;
    }
  }

  return formatKeys;
};

export const setStorageKeys = async (data: { [key: string]: string }): Promise<boolean> => {
  const keys = Object.entries(data);
  await keys.forEach(([key, value]: [string, string]) => {
    localStorage.setItem(key, value);
  });
  return true;
};
