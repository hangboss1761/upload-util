export interface ConnectOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  retry?: boolean;
  retryTimes?: number;
}

export interface UploadOptions {
  destRootPath: string;
  rootPath: string;
}

export interface UseUploaderResult {
  connect: (connectOptions: ConnectOptions) => Promise<any>;
  upload: (filePath: string, uploadOptions: UploadOptions) => Promise<any>;
  destory: () => Promise<any>;
}

export interface UploaderMixin<T = any> {
  create: () => T;
  connect: (client: T, connectOptions: ConnectOptions) => Promise<any>;
  upload: (
    client: T,
    filePath: string,
    uploadOptions: UploadOptions
  ) => Promise<any>;
  destory: (client: T) => Promise<any>;
}

export interface UploaderInstance<T = any> extends UploaderMixin<T> {
  client: T;
  destoryed: boolean;
}
