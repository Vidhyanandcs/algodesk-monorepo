/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 20000,
  transform: {
    "\\.teal$": "jest-raw-loader"
  },
  globals: {
    Uint8Array: Uint8Array,
    ArrayBuffer: ArrayBuffer
  },
};