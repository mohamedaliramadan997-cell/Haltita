/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'app',
      preset: 'jest-expo',
      testPathIgnorePatterns: ['/node_modules/', '<rootDir>/firebase/'],
    },
    {
      // Security-rules tests (T-033) run against the Firebase emulator via `npm run test:rules`.
      displayName: 'rules',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/firebase/**/*.test.ts'],
    },
  ],
};
