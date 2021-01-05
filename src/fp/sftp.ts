import * as Sftp from 'ssh2-sftp-client';
import { uploadFn } from '../widgets/upload';
import { getOriginPath, getDestPath, isDirectory } from '../widgets/file';
import { UploaderMixin, ConnectOptions, UploadOptions } from './interface';

export type SftpClient = Sftp;

export const sftpUploader: UploaderMixin = {
  create: () => new Sftp(),
  connect: (client: Sftp, connectOptions: ConnectOptions): Promise<any> => {
    return client.connect(connectOptions);
  },
  upload: (
    client: Sftp,
    filePath: string,
    uploadOptions: UploadOptions
  ): Promise<any> => {
    const { mkdir, put } = client;
    const localPath = getOriginPath(filePath, uploadOptions.rootPath);
    const destPath = getDestPath(filePath, uploadOptions.destRootPath);

    return uploadFn(
      isDirectory(localPath),
      mkdir.bind(client),
      [destPath, true],
      put.bind(client),
      [localPath, destPath]
    ) as Promise<string>;
  },
  destory: (client: Sftp): Promise<any> => {
    return client.end();
  }
};
