module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    'config/**/*.js',
  ],
  coverageThreshold: {
    global: { lines: 60 },
  },
  testTimeout: 30000,
}
