import * as glob from 'glob';
import * as fs from 'fs';

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
