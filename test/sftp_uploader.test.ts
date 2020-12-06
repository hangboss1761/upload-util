import { SftpUploader } from '../src/sftp_uploader';
import { sftpConfig } from './widgets/config';
describe('Uploader Sftp', () => {
  test('run uploader', async (done) => {
    const mockFn = jest.fn(() => {});
    const uploader = new SftpUploader(sftpConfig);

    await expect(uploader.connect()).resolves.toBeUndefined();
    await expect(uploader.startUpload()).resolves.toBeUndefined();

    uploader.on('upload:ready', mockFn);
    uploader.on('upload:start', mockFn);
    uploader.on('upload:success', () => {
      mockFn();
      uploader.destory();
    });
    uploader.on('upload:destroy', () => expect(mockFn.mock.calls.length).toBe(3));
    done();
  });
});
