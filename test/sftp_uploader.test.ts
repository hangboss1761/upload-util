import { SftpUploader } from '../src/sftp_uploader';
import { sftpConfig, retrySftpConfig, paramsErrorConfig } from './widgets/config';

describe('Uploader Sftp', () => {
  test('run uploader', async (done) => {
    const mockFn = jest.fn(() => {});
    const uploader = new SftpUploader(sftpConfig);

    uploader.on('upload:ready', mockFn);
    uploader.on('upload:start', mockFn);
    uploader.on('upload:connecting', mockFn);
    uploader.on('upload:success', () => {
      mockFn();
      uploader.destory();
    });
    uploader.on('upload:destroy', () =>
      expect(mockFn.mock.calls.length).toBe(4)
    );

    await expect(uploader.connect()).resolves.toBeUndefined();
    await expect(uploader.startUpload()).resolves.toBeUndefined();

    done();
  });

  test('sftp connect retry', async (done) => {
    // 连接会失败，并且失败后会重试1次,总共会触发2次upload:connecting事件
    const uploader = new SftpUploader(retrySftpConfig);
    const mockFn = jest.fn(() => {});

    uploader.on('upload:connecting', mockFn);

    await expect(uploader.connect()).rejects.toThrow();

    expect(mockFn.mock.calls.length).toBe(2);
    done();
  });

  test('sftp options params error', (done) => {
    expect(() => {
      new SftpUploader(paramsErrorConfig);
    }).toThrow();
    done();
  });
});
