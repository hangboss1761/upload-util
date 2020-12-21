import * as Client from 'ssh2-sftp-client';
import { Schema } from 'jsonschema';
import { BaseUploader } from './base_uploader';
import { getOriginPath, getDestPath, isDirectory } from './widgets/file';
import { logger } from './widgets/log';
import { jsonschemaValid, optionsSchema, ValidResult } from './widgets/valid';
import { uploadFn } from './widgets/upload';
import { Options } from './interface/interface';

export class SftpUploader extends BaseUploader {
  protected client: Client;

  constructor(options: Options) {
    super(options);
    this.uploadType = 'sftp';
    this.validInput(options, optionsSchema);
  }

  protected validInput(options: Options, schame: Schema): boolean {
    const validResult: ValidResult = jsonschemaValid(options, schame);

    if (!validResult.result) {
      logger.error(`[${this.uploadType} Uploader] ${validResult.msg}`);
      throw new Error(validResult.msg);
    }
    return true;
  }

  protected async connectFn(): Promise<Client> {
    const client = new Client();

    await client.connect({
      host: this.options.host,
      port: this.options.port,
      username: this.options.user,
      password: this.options.password
    });

    return client;
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
      mkdir.bind(this.client),
      [destPath, true],
      put.bind(this.client),
      [localPath, destPath]
    ) as Promise<string>;
  }

  protected async onDestoryed(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
    super.onDestoryed();
  }
}
