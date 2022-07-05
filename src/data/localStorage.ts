import { User } from '../interfaces/user';

const getKey = (key: string) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) return saved;
  }
  return undefined;
};

// eslint-disable-next-line import/prefer-default-export
export const getStorageKeys = async (keys: Array<'displayName' | 'email' | 'location' | 'weather' | 'day' | 'uid'>): Promise<User> => {
  const getKeys: any[] = await Promise.all(keys.map(async (key) => getKey(key)));
  const formatKeys: User = {};

  for (let index = 0; index < keys.length; index += 1) {
    if (getKeys[index] !== undefined) {
      const value = getKeys[index];
      formatKeys[keys[index]] = keys[index] === 'location' ? JSON.parse(value) : value;
    }
  }

  return formatKeys;
};

export const setStorageKeys = async (data: User): Promise<boolean> => {
  const keys = Object.entries(data);
  await keys.forEach(([key, value]: [string, string]) => {
    localStorage.setItem(key, key === 'location' ? JSON.stringify(value) : value);
  });
  return true;
};
