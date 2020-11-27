import { EventEmitter } from 'events';
import { Options } from './interface';

const showOverrideTips = (method: string, namespace = 'BaseUploader') => {
  throw new Error(`[${namespace}] Method: ${method} should be override`);
};

export class BaseUploader extends EventEmitter {
  options: Options;

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

  onReady() {}

  startUpload() {
    showOverrideTips('startUpload');
  }

  onStart() {}

  onFileUpload(filePath: string) {
    this.emit('upload:file', this.options, filePath);
  }

  onSuccess() {}

  onFailure(e: string) {
    console.error('[BaseUploader] file upload error.', e);
    this.emit('upload:failure', this.options, e);
  }

  onBeforeDestory() {}

  onDestoryed() {}

  destory() {}
}
