import {
  ConnectOptions,
  UploadOptions,
  UploaderMixin,
  UploaderInstance,
  UseUploaderResult,
  LifecycleHooks
} from './interface';
import { createHook, invokeHooks } from './hook';

const uploaderMap = new Map<string, UploaderMixin>();

const baseConnect = (uploaderInstance: UploaderInstance) => {
  return async (connectOptions: ConnectOptions): Promise<any> => {
    uploaderInstance.onConnecting && invokeHooks(uploaderInstance.onConnecting);
    const connectRes = await uploaderInstance.connect(
      uploaderInstance.client,
      connectOptions
    );

    uploaderInstance.onReady && invokeHooks(uploaderInstance.onReady);
    return connectRes;
  };
};

const baseUpload = (uploaderInstance: UploaderInstance) => {
  return async (file: string, uploadOptions: UploadOptions): Promise<any> => {
    uploaderInstance.onStart && invokeHooks(uploaderInstance.onStart, file);
    const uploadRes = await uploaderInstance.upload(
      uploaderInstance.client,
      file,
      uploadOptions
    );

    uploaderInstance.onFile && invokeHooks(uploaderInstance.onFile, file);
    return uploadRes;
  };
};

const baseDestory = (uploaderInstance: UploaderInstance) => {
  return async (): Promise<any> => {
    await uploaderInstance.destory(uploaderInstance.client);
    uploaderInstance.onDestoryed && invokeHooks(uploaderInstance.onDestoryed);
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
  const onFailure = createHook(LifecycleHooks.ON_FAILURE, uploaderInstance);
  const onDestoryed = createHook(LifecycleHooks.ON_DESTORY, uploaderInstance);

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
    onFailure,
    onDestoryed
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
