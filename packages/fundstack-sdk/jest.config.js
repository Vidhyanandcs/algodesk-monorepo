/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  transform: {
    "\\.teal$": "jest-raw-loader"
  }
};