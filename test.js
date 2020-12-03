/* eslint-disable */
require = require('esm')(module /*, options*/);

// const Client = require('ssh2-sftp-client');
// let sftp = new Client();
// sftp
//   .connect({
//     host: '47.107.157.97',
//     port: 22,
//     username: 'sftp',
//     password: 'Admin@123'
//   })
//   .then(() => {
//     return sftp.list('/');
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .then(() => {
//     sftp.end();
//   })
//   .catch((err) => {
//     console.error(err.message);
//   });

const { run } = require('./dist/index');

run({
  // ftp: {
  //   host: '47.107.157.97',
  //   port: 21,
  //   user: 'ftp',
  //   password: 'Admin@123',
  //   files: ['.vscode', 'tsconfig.json'],
  //   rootPath: './',
  //   destRootPath: '/gyh'
  // },
  sftp: {
    host: '47.107.157.97',
    port: 22,
    user: 'sftp',
    password: 'Admin@123',
    files: ['.vscode', 'tsconfig.json'],
    rootPath: './',
    destRootPath: '/gyh'
  }
});

/* eslint-enable */
