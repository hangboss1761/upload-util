module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/test/**/*test.[jt]s?(x)'],
  // testMatch: ['<rootDir>/test/**/ftp_uploader.test.[jt]s?(x)'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['src/**']
};
