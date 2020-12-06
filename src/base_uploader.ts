import { EventEmitter } from 'events';
import { Options } from './interface/interface';

const showOverrideTips = (method: string, namespace = 'Uploader') => {
  throw new Error(`[${namespace}] Method: ${method} should be override`);
};

export class BaseUploader extends EventEmitter {
  options: Options;

  destoryed = false;

  constructor(options: Options) {
    super();
    this.initOptions(options);
  }

  initOptions(options: Options) {
    this.options = options;
  }

  connect() {
    showOverrideTips('connect');
  }

  onReady() {
    console.log('[Uploader] connect ready.');
    this.emit('upload:ready');
  }

  startUpload() {
    showOverrideTips('startUpload');
  }

  onStart(files: string[]) {
    console.log('[Uploader] start.');
    this.emit('upload:start', this.options, files);
  }

  onFileUpload(filePath: string, files: string[]) {
    console.log(`[Uploader] file: ${filePath} upload successfully \n`);
    this.emit('upload:file', this.options, files, filePath);
  }

  onSuccess(files: string[]) {
    console.log(`[Uploader] all files uploaded successfully \n`);
    this.emit('upload:success', this.options, files);
  }

  onFailure(e: string) {
    console.error('[Uploader] file upload error.', e);
    this.emit('upload:failure', this.options, e);
  }

  onDestoryed() {
    this.emit('upload:destroy');
  }

  destory() {
    if (!this.destoryed) {
      this.options = null;
      this.removeAllListeners();
      this.onDestoryed();
      this.destoryed = true;
    }
  }
}
