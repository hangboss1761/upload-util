import { fromEvent } from 'rxjs';
import { Uploader } from './interface/common';

export class UploaderRunner {
  private uploaderMap: Map<string, Uploader>;

  constructor() {
    this.uploaderMap = new Map<string, Uploader>();
  }

  register(name: string, uploader: Uploader) {
    this.uploaderMap.set(name, uploader);
    fromEvent<Uploader>(uploader, 'upload:destroy').subscribe(() => this.unregister(name));
  }

  unregister(name: string) {
    this.uploaderMap.delete(name);
  }

  async start() {
    try {
      for (const [, uploader] of this.uploaderMap) {
        await uploader.connect();
        await uploader.startUpload();
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
