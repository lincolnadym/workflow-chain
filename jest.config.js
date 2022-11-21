module.exports = {
  preset: 'ts-jest',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-reports/' }],
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'CDK Test Report',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['test/util'],
  testPathIgnorePatterns: ['test/util'],
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: 'test-reports/',
  setupFiles: ['./environment-setup'],
}
