import { EventEmitter } from 'events';
import { Options } from './interface/interface';

const showOverrideTips = (method: string, namespace = 'BaseUploader') => {
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
    console.log('[BaseUploader] connect ready.');
    this.emit('upload:ready');
  }

  startUpload() {
    showOverrideTips('startUpload');
  }

  onStart() {
    console.log('[BaseUploader] start.');
    this.emit('upload:start');
  }

  onFileUpload(filePath: string) {
    console.log(`[BaseUploader] file: ${filePath} upload successfully \n`);
    this.emit('upload:file', this.options, filePath);
  }

  onSuccess() {
    console.log(`[BaseUploader] all files uploaded successfully \n`);
    this.emit('upload:success');
  }

  onFailure(e: string) {
    console.error('[BaseUploader] file upload error.', e);
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
