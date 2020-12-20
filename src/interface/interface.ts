export interface Options {
  host: string;
  port: number;
  user: string;
  password: string;
  files: string[];
  destRootPath: string;
  rootPath?: string;
  parallel?: boolean;
}

export interface Config {
  ftp?: Options;
  sftp?: Options;
}

export type UploaderType = 'ftp' | 'sftp';