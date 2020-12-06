import * as Client from 'ftp';
import * as fs from 'fs';
import * as path from 'path';
import { fromEvent } from 'rxjs';
import { BaseUploader } from './base_uploader';
import { Options } from './interface/interface';
import { parseFiles } from './util';

export class FtpUploader extends BaseUploader {
  client: Client;

  initOptions(options: Options) {
    this.options = options;
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      this.client = new Client();

      this.client.connect({
        host: this.options.host,
        port: this.options.port,
        user: this.options.user,
        password: this.options.password
      });

      fromEvent(this.client, 'ready').subscribe(() => {
        this.onReady();
        resolve();
      });
      fromEvent(this.client, 'error').subscribe((e: string) => {
        throw new Error(e);
      });
    });
  }

  /**
   * 上传单个文件/目录到目标服务器
   * @param filePath local file path
   * @param destPath 目标路径
   */
  private upload(filePath: string, destPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientCb = (error) => {
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
   * 依次上传所有文件
   */
  async startUpload(): Promise<void> {
    try {
      const parsedFiles = parseFiles(this.options.files);
      const getRealPath = (filePath: string) => path.join(this.options.rootPath || process.cwd(), filePath);
      const getDestPath = (filePath: string) => path.posix.join(this.options.destRootPath, filePath);

      this.onStart(parsedFiles);

      // 串行上传所有文件
      for (const filePath of parsedFiles) {
        await this.upload(getRealPath(filePath), getDestPath(filePath));
        this.onFileUpload(filePath, parsedFiles);
      }

      this.onSuccess(parsedFiles);
    } catch (error) {
      this.onFailure(error);
    }
  }

  onDestoryed(): void {
    if (this.client) {
      this.client.destroy();
      this.client = null;

      super.onDestoryed();
    }
  }
}
