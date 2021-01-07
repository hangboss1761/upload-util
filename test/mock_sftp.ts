export const defaultSftpMockImplementation = {
  connect: () => Promise.resolve(),
  mkdir: () => Promise.resolve(),
  put: () => Promise.resolve(),
  end: () => Promise.resolve()
};