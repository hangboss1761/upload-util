

export interface Options {
  host: string;
  port: number;
  user: string;
  password: string;
  files: string[];
  destRootPath: string;
  rootPath?: string;
}

export interface Config {
  ftp?: Options;
  sftp?: Options;
}