import {
  ConnectOptions,
  UploadOptions,
  UploaderMixin,
  UploaderInstance,
  UseUploaderResult
} from './interface';

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
  const connect = baseConnect(uploaderInstance);
  const upload = baseUpload(uploaderInstance);
  const destory = baseDestory(uploaderInstance);

  return {
    connect,
    upload,
    destory
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
