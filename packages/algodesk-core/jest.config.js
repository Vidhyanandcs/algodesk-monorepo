/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 20000,
  globals: {
    Uint8Array: Uint8Array,
    ArrayBuffer: ArrayBuffer,
    TextEncoder: TextEncoder
  },
};