import * as Client from 'ftp';
import * as fs from 'fs';
import { fromEvent } from 'rxjs';
import { BaseUploader } from './base_uploader';
import { parseFiles, getOriginPath, getDestPath } from './util';
import { Options } from './interface/interface';

export class FtpUploader extends BaseUploader {
  client: Client;

  constructor(options: Options) {
    super(options);
    this.uploadType = 'ftp';
  }

  private ftpConnect(): Promise<Client> {
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

  async connect(): Promise<void> {
    await super.connect(this.ftpConnect.bind(this));
  }

  /**
   * 上传单个文件/目录到目标服务器
   * @param filePath local file path
   * @param destPath 目标路径
   */
  private upload(filePath: string, destPath: string): Promise<string> {
    // todo: upload逻辑待优化
    return new Promise((resolve, reject) => {
      const clientCb = (error: Error): void => {
        if (error) {
          reject(error);
        } else {
          resolve(filePath);
        }
      };

      if (fs.statSync(filePath).isDirectory()) {
        this.client.mkdir(destPath, true, clientCb);
      } else {
        this.client.put(fs.readFileSync(filePath), destPath, false, clientCb);
      }
    });
  }

  /**
   * 上传所有文件
   */
  async startUpload(): Promise<void> {
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

  onDestoryed(): void {
    if (this.client) {
      this.client = null;
      super.onDestoryed();
    }
  }
}
