export const enum LifecycleHooks {
  ON_CONNECTING = 'onConnecting',
  ON_READY = 'onReady',
  ON_START = 'onStart',
  ON_FILE = 'onFile',
  ON_FAILURE = 'onFailure',
  ON_DESTORY = 'onDestoryed'
}

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
  connect: (connectOptions: ConnectOptions) => Promise<unknown>;
  upload: (filePath: string, uploadOptions: UploadOptions) => Promise<unknown>;
  destory: () => Promise<unknown>;
  [LifecycleHooks.ON_CONNECTING]: (hook: () => any) => any;
  [LifecycleHooks.ON_READY]: (hook: () => any) => any;
  [LifecycleHooks.ON_START]: (hook: (file?: string) => any) => any;
  [LifecycleHooks.ON_FILE]: (hook: (file?: string) => any) => any;
  [LifecycleHooks.ON_FAILURE]: (hook: (e: any) => any) => any;
  [LifecycleHooks.ON_DESTORY]: (hook: () => any) => any;
}

export interface UploaderMixin<T = any> {
  create: () => T;
  connect: (client: T, connectOptions: ConnectOptions) => Promise<unknown>;
  upload: (
    client: T,
    filePath: string,
    uploadOptions: UploadOptions
  ) => Promise<unknown>;
  destory: (client: T) => Promise<unknown>;
}

export interface UploaderInstance<T = any> extends UploaderMixin<T> {
  client: T;
  [LifecycleHooks.ON_CONNECTING]?: Function[] | null;
  [LifecycleHooks.ON_READY]?: Function[] | null;
  [LifecycleHooks.ON_START]?: Function[] | null;
  [LifecycleHooks.ON_FILE]?: Function[] | null;
  [LifecycleHooks.ON_FAILURE]?: Function[] | null;
  [LifecycleHooks.ON_DESTORY]?: Function[] | null;
  destoryed: boolean;
}
