const ftpConfig = {
  host: '172.23.193.62',
  port: 21,
  user: '',
  password: '',
  files: ['test', 'package.json'],
  destRootPath: '/gyh/ftp'
};

const sftpConfig = {
  host: '47.56.223.228',
  port: 22,
  user: 'root',
  password: '2020@host',
  files: ['test', 'package.json'],
  destRootPath: '/gyh/sftp'
};

const config = {
  ftp: ftpConfig,
  sftp: sftpConfig
};

export { config, ftpConfig, sftpConfig };
