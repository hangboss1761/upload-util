import * as util from 'util';

/**
 * 适配ftp上传时的相关参数，保证它们能够符合uploadFn的参数要求
 * @param dirUploadFn 上传文件夹的方法
 * @param dirParams 上传文件夹方法需要的参数列表
 * @param fileUpladFn 上传文件的方法
 * @param fileParams 上传文件方法需要的参数列表
 */
export const ftpUploadAdapter = (
  dirUploadFn: util.CustomPromisify<Function>,
  dirParams: any,
  fileUpladFn: util.CustomPromisify<Function>,
  fileParams: any
): any => {
  return {
    dirUploadFn: util.promisify(dirUploadFn)(...dirParams),
    dirParams,
    fileUpladFn: util.promisify(fileUpladFn)(...fileParams),
    fileParams
  };
};

/**
 * 上传文件or文件夹
 * @param isDirectory 是否是上传文件夹的场景
 * @param dirUploadFn 上传文件夹的方法
 * @param dirParams 上传文件夹方法需要的参数列表
 * @param fileUpladFn 上传文件的方法
 * @param fileParams 上传文件方法需要的参数列表
 */
export const uploadFn = (
  isDirectory: boolean,
  dirUploadFn: any,
  dirParams: any[],
  fileUpladFn: any,
  fileParams: any[]
): Promise<string | void> => {
  if (isDirectory) {
    return dirUploadFn(...dirParams);
  }
  return fileUpladFn(...fileParams);
};
