import {
  ConnectOptions,
  UploadOptions,
  UploaderMixin,
  UploaderInstance,
  UseUploaderResult,
  LifecycleHooks
} from './interface';
import { createHook } from './hook';

const uploaderMap = new Map<string, UploaderMixin>();

const baseConnect = (uploaderInstance: UploaderInstance) => {
  return async (connectOptions: ConnectOptions): Promise<any> => {
    return uploaderInstance.connect(uploaderInstance.client, connectOptions);
  };
};

const baseUpload = (uploaderInstance: UploaderInstance) => {
  return async (file: string, uploadOptions: UploadOptions): Promise<any> => {
    return uploaderInstance.upload(
      uploaderInstance.client,
      file,
      uploadOptions
    );
  };
};

const baseDestory = (uploaderInstance: UploaderInstance) => {
  return async (): Promise<any> => {
    return uploaderInstance.destory(uploaderInstance.client);
  };
};

const getUploaderInstance = (uploadMixin: UploaderMixin): UploaderInstance => {
  return {
    ...uploadMixin,
    client: uploadMixin.create(),
    destoryed: false
  };
};

export const useUploader = (type: string): UseUploaderResult => {
  const uploaderInstance: UploaderInstance = getUploaderInstance(
    uploaderMap.get(type)
  );

  // lifecycleHooks
  const onConnecting = createHook(
    LifecycleHooks.ON_CONNECTING,
    uploaderInstance
  );
  const onReady = createHook(LifecycleHooks.ON_READY, uploaderInstance);
  const onStart = createHook(LifecycleHooks.ON_START, uploaderInstance);
  const onFile = createHook(LifecycleHooks.ON_FILE, uploaderInstance);
  const onSuccess = createHook(LifecycleHooks.ON_SUCCESS, uploaderInstance);
  const onFailure = createHook(LifecycleHooks.ON_FAILURE, uploaderInstance);
  const onDestory = createHook(LifecycleHooks.ON_DESTORY, uploaderInstance);

  // core methods
  const connect = baseConnect(uploaderInstance);
  const upload = baseUpload(uploaderInstance);
  const destory = baseDestory(uploaderInstance);

  return {
    connect,
    upload,
    destory,
    onConnecting,
    onReady,
    onStart,
    onFile,
    onSuccess,
    onFailure,
    onDestory
  };
};

export const register = <T>(
  type: string,
  uploader: UploaderMixin<T>
): (() => void) => {
  if (!uploaderMap.get(type)) {
    uploaderMap.set(type, uploader);
  }

  return (): void => {
    uploaderMap.delete(type);
  };
};
