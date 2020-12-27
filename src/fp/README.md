# 函数式编程写法

## Usage

```ts
import { FtpUploader } from 'dist/ftp_uploader';
import { register, useUploader } from 'upload-util/fp/uploader';
import { glob } from 'upload-util/fp/util';
import { ftpUploader } from 'upload-util/fp/ftp';
import { sftpUploader } from 'upload-util/fp/sftp';

register('ftp', ftpUploader);
register('sftp', sftpUploader);

const options = {};

const {
  connect,
  upload,
  destory,
  onConnecting,
  onReady,
  onStart,
  onFile,
  onSuccess,
  onError,
  onDestory
} = useUploader('ftp', options);

const start = async () => {
  const files = glob(['test']);
  await connect({ retry: true, retryTimes: 3 });
  for (const filePath of files) {
    await upload(filePath, { quitOnError: true });
  }
  await destory();
};

start();

```

## API

```ts

```