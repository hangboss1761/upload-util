import * as Sftp from 'ssh2-sftp-client';
import { mocked } from 'ts-jest/utils';
import { ftpUploader, FtpClient } from '../src/fp/ftp';
import { sftpUploader, SftpClient } from '../src/fp/sftp';
import { register, useUploader } from '../src/fp/uploader';
// import { parseFiles } from '../src/widgets/file';

const connectOptions = {
  host: '10.32.133.30',
  port: 22,
  user: '',
  password: ''
};

register<FtpClient>('ftp', ftpUploader);
register<SftpClient>('sftp', sftpUploader);

jest.mock('ssh2-sftp-client', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: () => Promise.resolve(),
      mkdir: () => Promise.resolve(),
      put: () => Promise.resolve(),
      end: () => Promise.resolve()
    };
  });
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mocked(Sftp).mockClear();
});

describe('fp sftp upload', () => {
  // test('register work', () => {})
  test('connect work', async (done) => {
    const { connect } = useUploader('sftp');
    await connect(connectOptions);

    expect(Sftp).toHaveBeenCalledTimes(1);
    done();
  });
  test.only('connect retry work', async (done) => {
    const fakeErrorConnectFn = jest.fn(() => Promise.reject('error'));
    mocked(Sftp).mockImplementation((): any => {
      return {
        connect: fakeErrorConnectFn
      };
    });

    const { connect } = useUploader('sftp');
    await expect(
      connect({
        ...connectOptions,
        retry: true,
        retryTimes: 1
      })
    ).rejects.toThrowError(`Connect error! Retried 1 times then quit`);
    expect(fakeErrorConnectFn).toHaveBeenCalledTimes(2);
    done();
  });
  test('connect error', () => {});
  test('upload work', () => {});
  test('upload error', () => {});
  test('destory work', () => {});
});
