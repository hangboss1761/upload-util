import * as Client from 'ssh2-sftp-client';
import * as fs from 'fs';
import * as path from 'path';
import { BaseUploader } from './base_uploader';
import { Options } from './interface/interface';
import { parseFiles } from './util';

export class SftpUploader extends BaseUploader {
  client: Client;

  initOptions(options: Options) {
    this.options = options;
  }

  async connect() {
    try {
      this.client = new Client();
      await this.client.connect({
        host: this.options.host,
        port: this.options.port,
        username: this.options.user,
        password: this.options.password
      });
      this.onReady();
    } catch (e) {
      throw new Error(e);
    }
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

  onDestoryed() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    super.onDestoryed();
  }
}
