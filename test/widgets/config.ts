const ftpConfig = {
  host: '192.168.43.140',
  port: 21,
  user: '',
  password: '',
  files: ['test'],
  destRootPath: '/gyh/ftp'
};

const sftpConfig = {
  host: '47.107.157.97',
  port: 22,
  user: 'sftp',
  password: 'Admin@123',
  files: ['test'],
  destRootPath: '/gyh/sftp'
};

const config = {
  ftp: ftpConfig,
  sftp: sftpConfig
};

export { config, ftpConfig, sftpConfig };
