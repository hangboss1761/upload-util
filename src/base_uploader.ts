import { EventEmitter } from 'events';
import { from } from 'rxjs';
import { retry, switchMap } from 'rxjs/operators';
import { Schema } from 'jsonschema';
import { parseFiles } from './widgets/file';
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

  protected abstract upload(filePath: string): Promise<any>;

  public async connect(): Promise<void> {
    const retryTimes = this.options.retry ? this.options.retryTimes || 3 : 0;

    await from(Promise.resolve(1))
      .pipe(
        switchMap(() => this.connectFn()),
        retry(retryTimes)
      )
      .toPromise()
      .then((val) => {
        this.client = val;
        this.onReady();
      })
      .catch((e) => {
        if (retryTimes)
          logger.error(
            `[${this.uploadType} Uploader] connect error! Retried ${retryTimes} times then quit`
          );

        throw new Error(e);
      });
  }

  protected onReady(): void {
    logger.info(`[${this.uploadType} Uploader] connect ready.`);
    this.emit('upload:ready');
  }

  protected async parallelUpload(parsedFiles: string[]): Promise<void> {
    const getFileUpladMap = (): Promise<void>[] =>
      parsedFiles.map(async (filePath) => {
        await this.upload(filePath);
        this.onFileUpload(filePath, parsedFiles);
      });

    await Promise.all(getFileUpladMap())
      .then(() => {
        this.onSuccess(parsedFiles);
      })
      .catch((e) => {
        this.onFailure(e);
      });
  }

  protected async serialUpload(parsedFiles: string[]): Promise<void> {
    try {
      for (const filePath of parsedFiles) {
        await this.upload(filePath);
        this.onFileUpload(filePath, parsedFiles);
      }
      this.onSuccess(parsedFiles);
    } catch (e) {
      this.onFailure(e);
    }
  }

  public async startUpload(): Promise<void> {
    const parsedFiles = parseFiles(this.options.files);
    const serialOrParallelUpload = this.options.parallel
      ? this.parallelUpload.bind(this, parsedFiles)
      : this.serialUpload.bind(this, parsedFiles);

    this.onStart(parsedFiles);

    await serialOrParallelUpload();
  }

  protected onStart(files: string[]): void {
    logger.info(`[${this.uploadType} Uploader] start.`);
    this.emit('upload:start', this.options, files);
  }

  protected onConnecting(): void {
    logger.info(`[${this.uploadType} Uploader] on connecting.`);
    this.emit('upload:connecting');
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
