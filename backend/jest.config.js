export default {
  verbose: true,
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json", "node"],
  testMatch: ["**/tests/**/*.test.js", "**/__tests__/**/*.js"],
  globalSetup: "./jest.setup.js",
  globalTeardown: "./jest.teardown.js",
  testTimeout: 30000
};