const reactJestConfig = require('@teambit/react/jest/jest.config');

module.exports = {
  ...reactJestConfig,
  verbose: true,
  timers: 'modern',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest'),
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/prod_node_modules/',
    '<rootDir>/.git/',
    '<rootDir>/dist/',
  ],
  setupFilesAfterEnv: [
    require.resolve('@teambit/react/jest/setupTests'),
    require.resolve('./jest.setup.js'),
  ],
};
