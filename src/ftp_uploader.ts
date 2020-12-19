import * as Client from 'ftp';
import { Schema } from 'jsonschema';
import { fromEvent } from 'rxjs';
import { BaseUploader } from './base_uploader';
import {
  parseFiles,
  getOriginPath,
  getDestPath,
  isDirectory
} from './widgets/util';
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
   * @param filePath local file path
   * @param destPath 目标路径
   */
  private upload(filePath: string, destPath: string): Promise<string> {
    const { mkdir, put } = this.client;
    return uploadFn(
      isDirectory(filePath),
      mkdir.bind(this.client),
      [destPath, true],
      put.bind(this.client),
      [filePath, destPath, false]
    ) as Promise<string>;
  }

  /**
   * 上传所有文件
   */
  public async startUpload(): Promise<void> {
    const parsedFiles = parseFiles(this.options.files);
    const fileUpladMap = parsedFiles.map(async (filePath) => {
      await this.upload(
        getOriginPath(filePath, this.options.rootPath),
        getDestPath(filePath, this.options.destRootPath)
      );
      this.onFileUpload(filePath, parsedFiles);
    });

    this.onStart(parsedFiles);

    // 并行上传
    await Promise.all(fileUpladMap)
      .then(() => {
        this.client.destroy();
        this.onSuccess(parsedFiles);
      })
      .catch((e) => {
        this.client.destroy();
        this.onFailure(e);
      });
  }

  protected onDestoryed(): void {
    if (this.client) {
      this.client = null;
      super.onDestoryed();
    }
  }
}
