import { run } from '../src/index';
import { config } from './widgets/config';

describe('Upload', () => {
  test('run upload', async (done) => {
    await expect(run(config)).resolves.toBeUndefined();
    done();
  });
});
