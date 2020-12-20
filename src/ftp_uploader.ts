import * as Client from 'ftp';
import * as util from 'util';
import { Schema } from 'jsonschema';
import { fromEvent } from 'rxjs';
import { BaseUploader } from './base_uploader';
import { getOriginPath, getDestPath, isDirectory } from './widgets/util';
import { logger } from './widgets/log';
import { jsonschemaValid, optionsSchema, ValidResult } from './widgets/valid';
import { uploadFn } from './widgets/upload';
import { Options } from './interface/interface';

export class FtpUploader extends BaseUploader {
  protected client: Client;

  constructor(options: Options) {
    super(options);
    this.uploadType = 'ftp';
    this.validInput(options, optionsSchema);
  }

  protected validInput(options: Options, schame: Schema): boolean {
    const validResult: ValidResult = jsonschemaValid(options, schame);

    if (!validResult.result) {
      logger.error(`[${this.uploadType} Uploader] ${validResult.msg}`);
      throw new Error();
    }
    return true;
  }

  protected connectFn(): Promise<Client> {
    return new Promise((resolve, reject) => {
      const client = new Client();

      client.connect({
        host: this.options.host,
        port: this.options.port,
        user: this.options.user,
        password: this.options.password
      });

      fromEvent(client, 'ready').subscribe(() => {
        resolve(client);
      });
      fromEvent(client, 'error').subscribe((e: string) => {
        reject(e);
      });
    });
  }

  /**
   * 上传单个文件/目录到目标服务器
   * @param filePath file path
   */
  protected upload(filePath: string): Promise<string> {
    const { mkdir, put } = this.client;
    const localPath = getOriginPath(filePath, this.options.rootPath);
    const destPath = getDestPath(filePath, this.options.destRootPath);

    return uploadFn(
      isDirectory(localPath),
      util.promisify(mkdir.bind(this.client)),
      [destPath, true],
      util.promisify(put.bind(this.client)),
      [localPath, destPath, false]
    ) as Promise<string>;
  }

  protected onDestoryed(): void {
    if (this.client) {
      this.client.destroy();
      this.client = null;
      super.onDestoryed();
    }
  }
}
