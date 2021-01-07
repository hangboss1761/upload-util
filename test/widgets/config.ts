import { Options, Config } from '../../src/interface/interface';

export const ftpConfig: Options = {
  host: 'ftp.dlptest.com',
  port: 21,
  user: 'dlpuser@dlptest.com',
  password: 'eUj8GeW55SvYaswqUyDSm5v6N',
  files: ['test/demo'],
  destRootPath: '/',
  parallel: fa,
  retry: true
};

export const retryFtpConfig: Options = {
  host: '192.168.0.0', // error host
  port: 21,
  user: '',
  password: '',
  files: ['test/demo'],
  destRootPath: '/',
  parallel: true,
  retry: true,
  retryTimes: 1
};

export const paramsErrorConfig: any = {
  host: '192.168.0.0',
  port: 21
};

export const connectErrorConfig: any = {
  host: 'ftp.dlptest.com1',
  port: 21,
  user: 'dlpuser@dlptest.com',
  password: 'eUj8GeW55SvYaswqUyDSm5v6N',
  files: ['test/demo'],
  destRootPath: '/',
  parallel: true,
  retry: false
};

export const sftpConfig: Options = {
  host: '47.56.223.111',
  port: 22,
  user: 'root',
  password: 'root',
  files: ['test/demo'],
  destRootPath: '/'
};

export const retrySftpConfig: Options = {
  host: '47.56.223.111',
  port: 22,
  user: 'root',
  password: 'root',
  files: ['test/demo'],
  destRootPath: '/',
  retry: true,
  retryTimes: 1
};

export const config: Config = {
  ftp: {
    ...ftpConfig,
    files: ['test/demo']
  },
  sftp: {
    ...sftpConfig,
    files: ['test/demo']
  }
};
