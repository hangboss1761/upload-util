import { EventEmitter } from 'events';
import { Options, UploaderType } from './interface/interface';
import { logger } from './widgets/log';

export abstract class BaseUploader extends EventEmitter {
  options: Options;

  destoryed = false;

  client: any;

  uploadType: UploaderType;

  constructor(options: Options) {
    super();
    this.initOptions(options);
  }

  initOptions(options: Options): void {
    this.options = options;
  }

  async connect(connectFn): Promise<void> {
    try {
      this.client = await connectFn();
      this.onReady();
    } catch (e) {
      throw new Error(e);
    }
  }

  onReady(): void {
    logger.info(`[${this.uploadType} Uploader] connect ready.`);
    this.emit('upload:ready');
  }

  abstract startUpload(): void

  onStart(files: string[]): void {
    logger.info(`[${this.uploadType} Uploader] start.`);
    this.emit('upload:start', this.options, files);
  }

  onFileUpload(filePath: string, files: string[]): void {
    logger.info(`[${this.uploadType} Uploader] file: ${filePath} upload successfully \n`);
    this.emit('upload:file', this.options, files, filePath);
  }

  onSuccess(files: string[]): void {
    logger.info(`[${this.uploadType} Uploader] all files uploaded successfully \n`);
    this.emit('upload:success', this.options, files);
  }

  onFailure(e: any): void {
    logger.error(`${this.uploadType} [Uploader] file upload error.`, e);
    this.emit('upload:failure', this.options, e);
  }

  onDestoryed(): void {
    logger.info(`[${this.uploadType} Uploader] destory connect.`);
    this.emit('upload:destroy');
  }

  destory(): void {
    if (!this.destoryed) {
      this.options = null;
      this.removeAllListeners();
      this.onDestoryed();
      this.destoryed = true;
    }
  }
}
