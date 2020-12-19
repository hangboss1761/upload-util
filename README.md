# 文件上传
[![Build Status](https://travis-ci.com/hangboss1761/upload-util.svg?branch=master)](https://travis-ci.com/hangboss1761/upload-util) [![Coverage Status](https://coveralls.io/repos/github/hangboss1761/upload-util/badge.svg)](https://coveralls.io/github/hangboss1761/upload-util) [![GitHub license](https://img.shields.io/github/license/hangboss1761/upload-util)](https://github.com/hangboss1761/upload-util)
## Install

```bash
yarn add node-upload-util
# or
yarn add global node-upload-util
```
## Usage

- Use in cli

![cli](./screenshot/cli-demo.jpg)

- Import in your code

```js
import { run } from 'node-upload-util';

run({
  ftp: {
    host: '1.1.1.1',
    port: 21,
    user: 'username',
    password: '123456',
    files: ['file.txt', 'dir'],
    rootPath: '/',
    destRootPath: '/home/ftp'
  },
  sftp: {
    host: '1.1.1.1',
    port: 22,
    user: 'username',
    password: '123456',
    files: ['file.txt', 'dir'],
    rootPath: '/',
    destRootPath: '/home/sftp'
  },
})
```

## Dev

```bash
# clone code
git clone https://github.com/hangboss1761/upload-util

cd upload-util

# install dependencies
yarn

# start dev mode
yarn dev

# build for production
yarn build
```

- cli

```bash
npm link

upload start
```

## Test

```bash
yarn test
# or
yarn test:cover
```

## 单测覆盖率

![cover](./screenshot/cover.jpg)