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

const sftpConfig: Options = {
  host: '47.56.223.228',
  port: 22,
  user: 'root',
  password: '2020@host',
  files: ['demo.exe', 'test', 'package.json'],
  destRootPath: '/gyh/sftp',
  parallel: true
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

export { config, ftpConfig, sftpConfig };
