import glob from 'glob';
import fs from 'fs';
import path from 'path';

export const parseFiles = (files: string[] = [], rootPath = '') => {
  return files.reduce((acc, curr) => {
    let realPath = path.join(rootPath || process.cwd(), curr);

    if (fs.existsSync(realPath)) {
      if (fs.statSync(realPath).isDirectory()) {
        realPath += '/**';
        acc.push(...glob.sync(realPath));
      } else {
        acc.push(realPath);
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
