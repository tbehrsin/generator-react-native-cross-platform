
import _uuid from 'uuid';
import baseX from 'base-x';

export const base16 = baseX('0123456789abcdef');
export const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

export const uuid = (n = 1) => {
  const uuid = Array(n).fill().map(x => _uuid.v4().toString().replace(/[^\w]/g, '')).join('');
  return base62.encode(base16.decode(uuid));
};
