import Client from 'ssh2-sftp-client';
import { forkJoin, from } from 'rxjs';
import fs from 'fs';
import path from 'path';
import { BaseUploader } from './base_uploader';
import { Options } from './interface/interface';
import { parseFiles } from './util';

export class SftpUploader extends BaseUploader {
  client: Client;

  initOptions(options: Options) {
    this.options = options;
  }

  connect() {
    this.client = new Client();

    console.log('start connect');
    return this.client
      .connect({
        host: this.options.host,
        port: this.options.port,
        username: this.options.user,
        password: this.options.password
      })
      .then(() => {
        this.onReady();
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  /**
   * 上传单个文件/目录到目标服务器
   * @param filePath local file path
   * @param destPath 目标路径
   */
  private upload(filePath: string, destPath: string): Promise<string> {
    if (fs.statSync(filePath).isDirectory()) {
      return this.client.mkdir(destPath, true);
    }
    return this.client.put(filePath, destPath);
  }

  /**
   * 依次上传所有文件
   */
  startUpload() {
    const parsedFiles = parseFiles(this.options.files);
    const getRealPath = (filePath: string) => path.join(this.options.rootPath || process.cwd(), filePath);
    const getDestPath = (filePath: string) => path.posix.join(this.options.destRootPath, filePath);

    const fileUploadObservableMap = parsedFiles.map((filePath) =>
      from(this.upload(getRealPath(filePath), getDestPath(filePath)))
    );

    fileUploadObservableMap.forEach((fileUploadObservable) => {
      // 订阅每个文件上传成功出发的事件
      fileUploadObservable.subscribe((res) => this.onFileUpload(res));
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
      this.client.end();
      this.client = null;
    }
    super.onDestoryed();
  }
}
