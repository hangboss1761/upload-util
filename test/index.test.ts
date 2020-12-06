import { run } from '../src/index';
import { sftpConfig } from './widgets/config';

describe('Upload', () => {
  test('run upload', async (done) => {
    await expect(run({sftp: sftpConfig})).resolves.toBeUndefined();
    done();
  });
});
