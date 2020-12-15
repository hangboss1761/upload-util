import * as Client from 'ssh2-sftp-client';
import { BaseUploader } from './base_uploader';
import { parseFiles, getOriginPath, getDestPath, isDirectory } from './widgets/util';
import { uploadFn } from './widgets/upload';
import { Options } from './interface/interface';

export class SftpUploader extends BaseUploader {
  client: Client;

  constructor(options: Options) {
    super(options);
    this.uploadType = 'sftp';
  }

  private async sftpConnect(): Promise<Client> {
    const client = new Client();

    await client.connect({
      host: this.options.host,
      port: this.options.port,
      username: this.options.user,
      password: this.options.password
    });

    return client;
  }

  async connect(): Promise<void> {
    await super.connect(this.sftpConnect.bind(this));
  }

  /**
   * 上传单个文件/目录到目标服务器
   * @param filePath local file path
   * @param destPath 目标路径
   */
  private upload(filePath: string, destPath: string): Promise<string> {
    const { mkdir, put } = this.client;
    return uploadFn(isDirectory(filePath), mkdir, [destPath, true], put, [filePath, destPath]) as Promise<string>;
  }

  /**
   * 依次上传所有文件
   */
  async startUpload(): Promise<void> {
    try {
      const parsedFiles = parseFiles(this.options.files);

      this.onStart(parsedFiles);

      // 串行上传所有文件
      for (const filePath of parsedFiles) {
        await this.upload(
          getOriginPath(filePath, this.options.rootPath),
          getDestPath(filePath, this.options.destRootPath)
        );
        this.onFileUpload(filePath, parsedFiles);
      }

      await this.client.end();
      this.onSuccess(parsedFiles);
    } catch (error) {
      await this.client.end();
      this.onFailure(error);
    }
  }

  onDestoryed(): void {
    if (this.client) {
      this.client = null;
    }
    super.onDestoryed();
  }
}
