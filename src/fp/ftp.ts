import * as Client from 'ftp';
import * as util from 'util';
import { uploadFn } from '../widgets/upload';
import { getOriginPath, getDestPath, isDirectory } from '../widgets/file';
import { UploaderMixin, ConnectOptions, UploadOptions } from './interface';

export type FtpClient = Client;

export const ftpUploader: UploaderMixin = {
  create: () => new Client(),
  connect: (client: Client, connectOptions: ConnectOptions): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.connect(connectOptions);

      client.on('ready', () => resolve(client));
      client.on('error', (e) => reject(e));
    });
  },
  upload: (
    client: Client,
    filePath: string,
    uploadOptions: UploadOptions
  ): Promise<any> => {
    const { mkdir, put } = client;
    const localPath = getOriginPath(filePath, uploadOptions.rootPath);
    const destPath = getDestPath(filePath, uploadOptions.destRootPath);

    return uploadFn(
      isDirectory(localPath),
      util.promisify(mkdir.bind(client)),
      [destPath, true],
      util.promisify(put.bind(client)),
      [localPath, destPath, false]
    ) as Promise<string>;
  },
  destory: async (client: Client): Promise<any> => {
    client.destroy();
  }
};
