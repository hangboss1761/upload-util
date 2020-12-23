import { Options, Config } from '../../src/interface/interface';

const ftpConfig: Options = {
  host: 'ftp.dlptest.com',
  port: 21,
  user: 'dlpuser@dlptest.com',
  password: 'eUj8GeW55SvYaswqUyDSm5v6N',
  files: ['test', 'package.json'],
  destRootPath: '/',
  parallel: true,
  retry: true
};

const retryFtpConfig: Options = {
  host: '192.168.0.0', // error host
  port: 21,
  user: '',
  password: '',
  files: ['test', 'package.json'],
  destRootPath: '/gyh/ftp',
  parallel: true,
  retry: true,
  retryTimes: 1
};

const errorConfig: any = {
  host: '192.168.0.0',
  port: 21
};

const sftpConfig: Options = {
  host: '47.56.223.228',
  port: 22,
  user: 'root',
  password: '2020@host',
  files: ['demo.exe', 'test', 'package.json'],
  destRootPath: '/gyh/sftp'
};

const retrySftpConfig: Options = {
  host: '47.56.223.111',
  port: 22,
  user: 'root',
  password: '2020@host',
  files: ['demo.exe', 'test', 'package.json'],
  destRootPath: '/gyh/sftp',
  retry: true,
  retryTimes: 1
};

const config: Config = {
  ftp: {
    ...ftpConfig,
    files: ['package.json']
  },
  sftp: {
    ...sftpConfig,
    files: ['package.json']
  }
};

export {
  config,
  ftpConfig,
  retryFtpConfig,
  sftpConfig,
  retrySftpConfig,
  errorConfig
};
