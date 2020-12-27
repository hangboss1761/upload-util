import { ftpUploader, FtpClient } from '../src/fp/ftp';
import { sftpUploader, SftpClient } from '../src/fp/sftp';
import { register, useUploader } from '../src/fp/uploader';
import { parseFiles } from '../src/widgets/file';

register<FtpClient>('ftp', ftpUploader);
register<SftpClient>('sftp', sftpUploader);

// TODO: 实现事件机制
// TODO: 完善错误处理，重试、日志等功能
const {
  connect,
  upload,
  destory
  // onConnecting,
  // onReady,
  // onStart,
  // onFile,
  // onSuccess,
  // onError,
  // onDestory
} = useUploader('ftp');

const start = async () => {
  const files = parseFiles(['test']);
  await connect({
    host: '192.168.0.105',
    port: 21,
    user: '',
    password: ''
  });
  for (const filePath of files) {
    await upload(filePath, {
      rootPath: process.cwd(),
      destRootPath: '/gyh/ftp'
    });
    console.log('filePath success :>> ', filePath);
  }
  await destory();
};

start();
