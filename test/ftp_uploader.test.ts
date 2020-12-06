import { FtpUploader } from '../src/ftp_uploader';
import { ftpConfig } from './widgets/config';

jest.setTimeout(30000);

describe('Uploader Ftp', () => {
  test('run uploader', async () => {
    const mockFn = jest.fn(() => {});
    const uploader = new FtpUploader(ftpConfig);

    await expect(uploader.connect()).resolves.toBeUndefined();
    await expect(uploader.startUpload()).resolves.toBeUndefined();

    uploader.on('upload:ready', mockFn);
    uploader.on('upload:start', mockFn);
    uploader.on('upload:success', () => {
      mockFn();
      uploader.destory();
    });
    uploader.on('upload:destroy', () => expect(mockFn.mock.calls.length).toBe(3));
  });
});