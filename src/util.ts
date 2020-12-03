import glob from 'glob';
import fs from 'fs';

export const parseFiles = (files: string[] = []): string[] => {
  return files.reduce((acc, curr) => {
    if (fs.existsSync(curr)) {
      if (fs.statSync(curr).isDirectory()) {
        // eslint-disable-next-line no-param-reassign
        curr += '/**';
        acc.push(...glob.sync(curr));
      } else {
        acc.push(curr);
      }
    }

    return acc;
  }, []);
};

export const objToArray = <T>(data: T[] | T): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
};
