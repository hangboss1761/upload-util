import * as Sftp from 'ssh2-sftp-client';
import { mocked } from 'ts-jest/utils';
import { ftpUploader, FtpClient } from '../src/fp/ftp';
import { sftpUploader, SftpClient } from '../src/fp/sftp';
import { register, useUploader } from '../src/fp/uploader';
import { parseFiles } from '../src/widgets/file';

const connectOptions = {
  host: '10.32.133.30',
  port: 22,
  user: '',
  password: ''
};

const defaultSftpMockImplementation = {
  connect: () => Promise.resolve(),
  mkdir: () => Promise.resolve(),
  put: () => Promise.resolve(),
  end: () => Promise.resolve()
};

register<FtpClient>('ftp', ftpUploader);
register<SftpClient>('sftp', sftpUploader);

// mock sftp
jest.mock('ssh2-sftp-client', () => {
  return jest.fn().mockImplementation(() => defaultSftpMockImplementation);
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mocked(Sftp).mockClear();
});

describe('fp sftp upload', () => {
  afterEach(() => {
    // reset to default
    mocked(Sftp).mockImplementation((): any => defaultSftpMockImplementation);
  });

  test('lifecycleHooks work', async (done) => {
    const lifecycleMockFn = jest.fn(() => {});
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
    } = useUploader('sftp');

    onConnecting(lifecycleMockFn);
    onReady(lifecycleMockFn);
    onStart(lifecycleMockFn);
    onFile(lifecycleMockFn);
    onFailure(lifecycleMockFn);
    onDestoryed(lifecycleMockFn);

    await connect(connectOptions);
    await upload(parseFiles(['test/demo/demo.txt'])[0], {
      rootPath: process.cwd(),
      destRootPath: '/'
    });
    await destory();

    expect(lifecycleMockFn).toBeCalledTimes(6);
    done();
  });

  // test('register work', () => {})
  test('connect work', async (done) => {
    const { connect, destory } = useUploader('sftp');
    await connect(connectOptions);

    expect(Sftp).toHaveBeenCalledTimes(1);
    await destory();
    done();
  });
  test('connect retry error', async (done) => {
    const fakeErrorConnectFn = jest.fn(() => Promise.reject('error'));
    mocked(Sftp).mockImplementation((): any => {
      return {
        ...defaultSftpMockImplementation,
        connect: fakeErrorConnectFn
      };
    });

    const { connect, destory } = useUploader('sftp');
    await expect(
      connect({
        ...connectOptions,
        retry: true,
        retryTimes: 1
      })
    ).rejects.toThrow();
    expect(fakeErrorConnectFn).toHaveBeenCalledTimes(2);
    await destory();
    done();
  });
  test('connect retry successed', async (done) => {
    const onceErrorOnceSuccessConnectFn = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject('error'))
      .mockImplementationOnce(() => Promise.resolve());

    mocked(Sftp).mockImplementation((): any => ({
      ...defaultSftpMockImplementation,
      connect: onceErrorOnceSuccessConnectFn
    }));

    const { connect, destory } = useUploader('sftp');

    await expect(
      connect({
        ...connectOptions,
        retry: true,
        retryTimes: 1
      })
    ).resolves.toBeUndefined();

    expect(onceErrorOnceSuccessConnectFn).toBeCalledTimes(2);
    await destory();
    done();
  });
  test.only('connect error', async (done) => {
    mocked(Sftp).mockImplementation((): any => ({
      ...defaultSftpMockImplementation,
      connect: () => Promise.reject('error')
    }));

    const { connect, destory } = useUploader('sftp');
    await expect(connect(connectOptions)).rejects.toThrow();
    await destory();
    done();
  });
  test.only('upload work', async (done) => {
    const { connect, upload, destory } = useUploader('sftp');
    await connect(connectOptions);
    await expect(
      upload(parseFiles(['test/demo/demo.txt'])[0], {
        rootPath: process.cwd(),
        destRootPath: '/'
      })
    ).resolves;
    await destory();
    done();
  });
  test('upload error', async (done) => {
    mocked(Sftp).mockImplementation((): any => ({
      ...defaultSftpMockImplementation,
      mkdir: () => Promise.reject('error'),
      put: () => Promise.reject('error')
    }));

    const { connect, upload, destory } = useUploader('sftp');
    await connect(connectOptions);
    await expect(
      upload(parseFiles(['test/demo/demo.txt'])[0], {
        rootPath: process.cwd(),
        destRootPath: '/'
      })
    ).rejects.toThrow();
    await destory();
    done();
  });
  test.only('destory work', async (done) => {
    mocked(Sftp).mockImplementation((): any => ({
      ...defaultSftpMockImplementation,
      end: () => Promise.reject('error')
    }));
    const { connect, destory } = useUploader('sftp');
    await connect(connectOptions);
    await expect(destory()).rejects.toThrow();
    done();
  });
});
