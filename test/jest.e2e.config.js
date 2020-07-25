module.exports = {
  preset: 'jest-playwright-preset',

  testMatch: ['**/test/**/*.test.js'],

  testEnvironment: './custom-jest-environment.js',
  bail: 1,
  verbose: true,
};
