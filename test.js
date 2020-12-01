/* eslint-disable */
require = require("esm")(module/*, options*/)

const {run} = require('./dist/index')


run({
  ftp: {
    host: '47.107.157.97',
    port: 21,
    user: 'ftp',
    password: 'Admin@123',
    files: [
      'tsconfig.json'
    ],
    rootPath: './',
    destRootPath:'/gyh'
  }
})


/* eslint-enable */
