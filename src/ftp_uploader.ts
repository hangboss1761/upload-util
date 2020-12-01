import Client from 'ftp';
import fs from 'fs';
import path from 'path';
import { fromEvent, forkJoin, from } from 'rxjs';
import { BaseUploader } from './base_uploader';
import { Options } from './interface/interface';
import { parseFiles } from './util';

export class FtpUploader extends BaseUploader {
  client: Client;

  initOptions(options: Options) {
    this.options = options;
  }

  connect() {
    this.client = new Client();

    console.log('start connect');
    this.client.connect({
      host: this.options.host,
      port: this.options.port,
      user: this.options.user,
      password: this.options.password
    });

    fromEvent(this.client, 'ready').subscribe(() => this.onReady());
    fromEvent(this.client, 'error').subscribe((e: string) => {
      throw new Error(e);
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
        this.client.mkdir(filePath, true, clientCb);
      } else {
        this.client.put(filePath, destPath, false, clientCb);
      }
    });
  }

  /**
   * 依次上传所有文件
   */
  startUpload() {
    const parsedFiles = parseFiles(this.options.files);
    const getRealPath = (filePath: string) => path.join(this.options.rootPath || process.cwd(), filePath);
    const getDestPath = (filePath: string) => path.join(this.options.destRootPath || '', filePath);

    const fileUploadObservableMap = parsedFiles.map((filePath) =>
      from(this.upload(getRealPath(filePath), getDestPath(filePath)))
    );

    fileUploadObservableMap.forEach((fileUploadObservable) => {
      // 订阅每个文件上传成功出发的事件
      fileUploadObservable.subscribe(this.onFileUpload);
    });

    // 作用类似Promise.all
    forkJoin(fileUploadObservableMap).subscribe(
      () => {
        this.client.end();
        this.onSuccess();
      },
      (e) => {
        this.client.end();
        this.onFailure(e);
      }
    );
  }

  onDestoryed() {
    if (this.client) {
      this.client.destroy();
      this.client = null;

      super.onDestoryed();
    }
  }
}
