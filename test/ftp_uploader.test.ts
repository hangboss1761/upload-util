import { FtpUploader } from '../src/ftp_uploader';
import {
  ftpConfig,
  retryFtpConfig,
  paramsErrorConfig,
  connectErrorConfig
} from './widgets/config';

describe('Uploader Ftp', () => {
  test('run uploader', async (done) => {
    const mockFn = jest.fn(() => {});
    const uploader = new FtpUploader(ftpConfig);

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
  test('upload a not exist file/dir', async (done) => {
    const uploader = new FtpUploader({
      ...ftpConfig,
      files: ['not_exist_file.txt', 'not_exist_dir']
    });

    await uploader.connect();
    await expect(uploader.startUpload()).resolves.toBeUndefined();
    uploader.destory();

    done();
  });

  test('ftp connect error', async (done) => {
    const uploader = new FtpUploader(connectErrorConfig);

    await expect(uploader.connect()).rejects.toThrow();
    uploader.destory();
    done();
  });

  test('ftp connect retry', async (done) => {
    // 连接会失败，并且失败后会重试1次,总共会触发2次upload:connecting事件
    const uploader = new FtpUploader(retryFtpConfig);
    const mockFn = jest.fn(() => {});

    uploader.on('upload:connecting', mockFn);

    await expect(uploader.connect()).rejects.toThrow();

    expect(mockFn.mock.calls.length).toBe(2);
    done();
  });

  test('ftp options params error', (done) => {
    expect(() => {
      new FtpUploader(paramsErrorConfig);
    }).toThrow();
    done();
  });

  test('ftp destory', async (done) => {
    const uploader = new FtpUploader({
      ...ftpConfig,
      files: []
    });
    const mockFn = jest.fn(() => {});

    uploader.on('upload:destroy', mockFn);
    await uploader.connect();
    await uploader.startUpload();

    uploader.destory();

    expect(mockFn).toHaveBeenCalled();

    done();
  });
});
