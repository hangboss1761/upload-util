import {FtpUploader} from './ftp_uploader';
import {SftpUploader} from './sftp_uploader';

export interface Options {
  host: string;
  port: number;
  user: string;
  password: string;
  root: string;
  files: string[];
  rootPath?: string;
}

export interface Config {
  ftp: Options;
  sftp: Options;
}

export type Uploader = FtpUploader | SftpUploader;
