import { from } from 'rxjs';
import { retry, switchMap } from 'rxjs/operators';
import {
  ConnectOptions,
  UploadOptions,
  UploaderMixin,
  UploaderInstance,
  UseUploaderResult,
  LifecycleHooks
} from './interface';
import { createHook, invokeHooks } from './hook';
import { logger } from '../widgets/log';

const uploaderMap = new Map<string, UploaderMixin>();

const baseConnect = (uploaderInstance: UploaderInstance) => {
  return async (connectOptions: ConnectOptions): Promise<any> => {
    const retryTimes = connectOptions.retry
      ? connectOptions.retryTimes || 3
      : 0;
    logger.trace(connectOptions);

    try {
      const res = await from(Promise.resolve(1))
        .pipe(
          switchMap(() =>
            uploaderInstance.connect(uploaderInstance.client, connectOptions)
          ),
          retry(retryTimes)
        )
        .toPromise();
      logger.info('Connect ready.');

      invokeHooks(uploaderInstance.onReady);
      return res;
    } catch (error) {
      if (retryTimes)
        logger.error(`Connect error! Retried ${retryTimes} times then quit`);
      throw Error(error);
    }
  };
};

const baseUpload = (uploaderInstance: UploaderInstance) => {
  return async (file: string, uploadOptions: UploadOptions): Promise<any> => {
    try {
      logger.info(`Start upload file: ${file}`);
      invokeHooks(uploaderInstance.onStart, file);
      const uploadRes = await uploaderInstance.upload(
        uploaderInstance.client,
        file,
        uploadOptions
      );

      logger.info(`File upload successfully: ${file}`);

      invokeHooks(uploaderInstance.onFile, file);
      return uploadRes;
    } catch (error) {
      logger.info(`File upload failed: ${file}`);
      invokeHooks(uploaderInstance.onFailure, error);
      return Promise.reject(Error(`File upload failed: ${file}`));
    }
  };
};

const baseDestory = (uploaderInstance: UploaderInstance) => {
  return async (): Promise<any> => {
    try {
      await uploaderInstance.destory(uploaderInstance.client);
      logger.info('Destroyed successfully.');
      invokeHooks(uploaderInstance.onDestoryed);
    } catch (error) {
      throw Error(error);
    }
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
  if (!uploaderMap.get(type)) {
    throw Error(`${type} type not registered.`);
  }

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
