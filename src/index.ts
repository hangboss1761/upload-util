import { fromEvent } from 'rxjs';
import { Options, Config } from './interface/interface';
import { FtpUploader } from './ftp_uploader';
import { SftpUploader } from './sftp_uploader';
import { UploaderRunner } from './uploader_runner';

const uploadFactory = (constructor, options: Options) => {
  const upload = new constructor(options);
  let successFileCount = 0;

  fromEvent(upload, 'upload:start').subscribe(([, files]) =>
    console.log(`${files.length} files waiting to be uploaded`)
  );
  fromEvent(upload, 'upload:file').subscribe(() => ++successFileCount);
  fromEvent(upload, 'upload:failure').subscribe(() => upload.destory());
  fromEvent(upload, 'upload:success').subscribe(() => {
    console.log(`${successFileCount} files uploaded successfully`);
    upload.destory();
  });
  return upload;
};

export const run = (config: Config) => {
  const uploaderRunner = new UploaderRunner();
  if (config.ftp) {
    uploaderRunner.register('ftp', uploadFactory(FtpUploader, config.ftp));
  }

  if (config.sftp) {
    uploaderRunner.register('sftp', uploadFactory(SftpUploader, config.sftp));
  }

  return uploaderRunner.start().catch((e) => {
    throw new Error(e);
  });
};
