/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 10 * 60 * 1000,
  transform: {
    "\\.teal$": "jest-raw-loader"
  },
  globals: {
    Uint8Array: Uint8Array,
    ArrayBuffer: ArrayBuffer,
    TextEncoder: TextEncoder
  },
};