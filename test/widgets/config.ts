import { Options, Config } from '../../src/interface/interface';

const ftpConfig: Options = {
  host: '192.168.0.107',
  port: 21,
  user: '',
  password: '',
  files: ['demo.mkv', 'test', 'package.json'],
  destRootPath: '/gyh/ftp',
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

export { config, ftpConfig, retryFtpConfig, sftpConfig, retrySftpConfig };
