import * as util from 'util';

// TODO: 补充类型声明与注释
export const ftpUploadAdapter = (dirUploadFn, dirParams, fileUpladFn, fileParams): any => {
  return {
    dirUploadFn: util.promisify(dirUploadFn)(...dirParams),
    dirParams,
    fileUpladFn: util.promisify(fileUpladFn)(...fileParams),
    fileParams
  };
};

export const uploadFn = (isDirectory, dirUploadFn, dirParams, fileUpladFn, fileParams): Promise<string | void> => {
  if (isDirectory) {
    return dirUploadFn(...dirParams);
  }
  return fileUpladFn(...fileParams);
};
