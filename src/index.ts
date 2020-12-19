import { fromEvent } from 'rxjs';
import { Options, Config } from './interface/interface';
import { Uploader } from './interface/common';
import { FtpUploader } from './ftp_uploader';
import { SftpUploader } from './sftp_uploader';
import { UploaderRunner } from './widgets/uploader_runner';
import { logger } from './widgets/log';

const uploadFactory = (constructor, options: Options): Uploader => {
  const upload = new constructor(options);
  let successFileCount = 0;

  fromEvent(upload, 'upload:start').subscribe(([, files]) =>
    logger.info(`${files.length} files waiting to be uploaded`)
  );
  fromEvent(upload, 'upload:file').subscribe(() => ++successFileCount);
  fromEvent(upload, 'upload:failure').subscribe(() => upload.destory());
  fromEvent(upload, 'upload:success').subscribe(() => {
    logger.info(`${successFileCount} files uploaded successfully`);
    upload.destory();
  });
  return upload;
};

export const run = async (config: Config): Promise<void> => {
  const uploaderRunner = new UploaderRunner();
  if (config.ftp) {
    uploaderRunner.register('ftp', uploadFactory(FtpUploader, config.ftp));
  }

  if (config.sftp) {
    uploaderRunner.register('sftp', uploadFactory(SftpUploader, config.sftp));
  }

  try {
    return uploaderRunner.start();
  } catch (e) {
    throw new Error(e);
  }
};
