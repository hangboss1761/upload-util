import { run } from '../src/index';
import { sftpConfig } from './widgets/config';

describe('Upload', () => {
  test('run upload', () => {
    return expect(
      run({
        sftp: sftpConfig
      })
    ).resolves.toBeUndefined();
  });
});
