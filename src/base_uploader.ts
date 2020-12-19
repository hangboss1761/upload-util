import { EventEmitter } from 'events';
import { Schema } from 'jsonschema';
import { Options, UploaderType } from './interface/interface';
import { logger } from './widgets/log';

export abstract class BaseUploader extends EventEmitter {
  protected options: Options;

  protected destoryed = false;

  protected client: any;

  protected uploadType: UploaderType;

  constructor(options: Options) {
    super();
    this.initOptions(options);
  }

  protected initOptions(options: Options): void {
    logger.trace(options);
    this.options = options;
  }

  protected abstract validInput(options: Options, schame: Schema): boolean;

  protected abstract connectFn(): Promise<any>;

  public async connect(): Promise<void> {
    try {
      this.client = await this.connectFn();
      this.onReady();
    } catch (e) {
      throw new Error(e);
    }
  }

  protected onReady(): void {
    logger.info(`[${this.uploadType} Uploader] connect ready.`);
    this.emit('upload:ready');
  }

  public abstract startUpload(): void;

  protected onStart(files: string[]): void {
    logger.info(`[${this.uploadType} Uploader] start.`);
    this.emit('upload:start', this.options, files);
  }

  protected onFileUpload(filePath: string, files: string[]): void {
    logger.info(
      `[${this.uploadType} Uploader] file: ${filePath} upload successfully \n`
    );
    this.emit('upload:file', this.options, files, filePath);
  }

  protected onSuccess(files: string[]): void {
    logger.info(
      `[${this.uploadType} Uploader] all files uploaded successfully \n`
    );
    this.emit('upload:success', this.options, files);
  }

  protected onFailure(e: any): void {
    logger.error(`${this.uploadType} [Uploader] file upload error.`, e);
    this.emit('upload:failure', this.options, e);
  }

  protected onDestoryed(): void {
    logger.info(`[${this.uploadType} Uploader] destory connect.`);
    this.emit('upload:destroy');
  }

  public destory(): void {
    if (!this.destoryed) {
      this.options = null;
      this.onDestoryed();
      this.removeAllListeners();
      this.destoryed = true;
    }
  }
}
