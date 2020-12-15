import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 通过glob模式解析出目标文件
 * @param files 文件路径数组
 */
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

/**
 * 获取目标文件的绝对路径
 * @param filePath 源文件相对路径
 * @param rootPath 查找的根路径
 */
export const getOriginPath = (filePath: string, rootPath?: string): string =>
  path.join(rootPath || process.cwd(), filePath);

/**
 * 获取目标文件在服务器上的绝对路径
 * @param filePath 源文件相对路径
 * @param destRootPath 目标服务器上的根路径
 */
export const getDestPath = (filePath: string, destRootPath: string): string => path.posix.join(destRootPath, filePath);

/**
 * 判断文件路径是否为文件夹
 * @param filePath 源文件路径
 */
export const isDirectory = (filePath: string): boolean => fs.statSync(filePath).isDirectory()