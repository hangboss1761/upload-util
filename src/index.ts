import { Options, Config } from './interface';
import { FtpUploader } from './ftp_uploader';
import { SftpUploader } from './sftp_uploader';
import { UploaderRunner } from './uploader_runner';

const uploadFactory = (constructor, options: Options) => {
  const upload = new constructor(options);

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

  uploaderRunner.start().then(() => process.exit(0))
};
