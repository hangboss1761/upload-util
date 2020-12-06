const ftpConfig = {
  host: '47.107.157.97',
  port: 21,
  user: 'ftp',
  password: 'Admin@123',
  files: [''],
  // rootPath: '/',
  destRootPath: '/gyh/sftp'
};

const sftpConfig = {
  host: '47.107.157.97',
  port: 22,
  user: 'sftp',
  password: 'Admin@123',
  files: ['test'],
  // rootPath: '/',
  destRootPath: '/gyh/sftp'
};

const config = {
  ftp: ftpConfig,
  sftp: sftpConfig
};

export { config, ftpConfig, sftpConfig };
