import { ftpUploader, FtpClient } from '../src/fp/ftp';
import { sftpUploader, SftpClient } from '../src/fp/sftp';
import { register, useUploader } from '../src/fp/uploader';
import { parseFiles } from '../src/widgets/file';

register<FtpClient>('ftp', ftpUploader);
register<SftpClient>('sftp', sftpUploader);

// TODO: 完善错误处理，重试、日志等功能
const {
  connect,
  upload,
  destory,
  onConnecting,
  onReady,
  onStart,
  onFile,
  onFailure,
  onDestoryed
} = useUploader('ftp');

onConnecting(() => {
  console.log('on-connection');
});
onReady(() => {
  console.log('on-onReady');
});
onStart((file: string) => {
  console.log('on-onStart: ', file);
});
onFile((file: string) => {
  console.log('on-onFile: ', file);
});
onFailure((e) => {
  console.log('on-onFailure: ', e);
});
onDestoryed(() => {
  console.log('on-onDestoryed');
});

const start = async () => {
  const files = parseFiles(['test']);
  await connect({
    host: '10.32.133.30',
    port: 21,
    user: '',
    retry: true,
    retryTimes: 1,
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
