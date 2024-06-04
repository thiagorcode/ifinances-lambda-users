/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  verbose: false,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/layers/',
    '<rootDir>/.aws-sam',
    '<rootDir>/src/__tests__/__mocks__',
    '<rootDir>/jest.config.ts',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  setupFilesAfterEnv: ['./jest.config.ts'],
}
