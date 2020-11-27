import Client from 'ftp';
import { fromEvent, forkJoin, from } from 'rxjs';
import { BaseUploader } from './base_uploader';
import { Options } from './interface';

export class FtpUploader extends BaseUploader {
  client: Client;

  initOptions(options: Options) {
    this.options = options;
  }

  connect() {
    this.client = new Client();

    this.client.connect({
      host: this.options.host,
      port: this.options.port,
      user: this.options.user,
      password: this.options.password
    });

    fromEvent(this.client, 'ready').subscribe(this.onReady);
    fromEvent(this.client, 'error').subscribe((e: string) => {
      throw new Error(e);
    });
  }

  private upload(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(filePath);
    });
  }

  startUpload() {
    const uploadObservableMap = this.options.files.map((filePath) => from(this.upload(filePath)));

    uploadObservableMap.forEach((uploadObservalbe) => {
      uploadObservalbe.subscribe(this.onFileUpload);
    });

    // 作用类似Promise.all
    forkJoin(uploadObservableMap).subscribe(
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
      this.client.destroy();
      this.client = null;

      super.onDestoryed();
    }
  }
}
