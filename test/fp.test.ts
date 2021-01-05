import { ftpUploader, FtpClient } from '../src/fp/ftp';
import { sftpUploader, SftpClient } from '../src/fp/sftp';
import { register, useUploader } from '../src/fp/uploader';
import { parseFiles } from '../src/widgets/file';

register<FtpClient>('ftp', ftpUploader);
register<SftpClient>('sftp', sftpUploader);

describe('fp upload', () => {
  test('register work', () => {})
  test('connect work', () => {})
  test('connect retry work', () => {})
  test('connect error', () => {})
  test('upload work', () => {})
  test('upload error', () => {})
  test('destory work', () => {})
})