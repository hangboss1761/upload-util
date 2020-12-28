export const enum LifecycleHooks {
  ON_CONNECTING = 'onConnecting',
  ON_READY = 'onReady',
  ON_START = 'onStart',
  ON_FILE = 'onFile',
  ON_SUCCESS = 'onSuccess',
  ON_FAILURE = 'onFailure',
  ON_DESTORY = 'onDestory'
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
  connect: (connectOptions: ConnectOptions) => Promise<any>;
  upload: (filePath: string, uploadOptions: UploadOptions) => Promise<any>;
  destory: () => Promise<any>;
  [LifecycleHooks.ON_CONNECTING]: (hook: () => any) => any;
  [LifecycleHooks.ON_READY]: (hook: () => any) => any;
  [LifecycleHooks.ON_START]: (hook: () => any) => any;
  [LifecycleHooks.ON_FILE]: (hook: () => any) => any;
  [LifecycleHooks.ON_SUCCESS]: (hook: () => any) => any;
  [LifecycleHooks.ON_FAILURE]: (hook: () => any) => any;
  [LifecycleHooks.ON_DESTORY]: (hook: () => any) => any;
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
  [LifecycleHooks.ON_CONNECTING]?: Function[] | null;
  [LifecycleHooks.ON_READY]?: Function[] | null;
  [LifecycleHooks.ON_START]?: Function[] | null;
  [LifecycleHooks.ON_FILE]?: Function[] | null;
  [LifecycleHooks.ON_SUCCESS]?: Function[] | null;
  [LifecycleHooks.ON_FAILURE]?: Function[] | null;
  [LifecycleHooks.ON_DESTORY]?: Function[] | null;
  destoryed: boolean;
}
