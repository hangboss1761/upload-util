module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  testMatch: ['<rootDir>/test/**/*test.[jt]s?(x)'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: ['src/**']
};
