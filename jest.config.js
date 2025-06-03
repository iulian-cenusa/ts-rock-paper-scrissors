module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use Node.js environment for tests
  testMatch: ['<rootDir>/src/**/*.test.ts'], // Look for .test.ts files in src
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};