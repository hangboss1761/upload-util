import { FtpUploader } from '../ftp_uploader';
import { SftpUploader } from '../sftp_uploader';

export type Uploader = FtpUploader | SftpUploader;
