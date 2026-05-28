module.exports = {
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
      testPathIgnorePatterns: ['<rootDir>/tests/ui/'],
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
    },
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/ui/**/*.test.js'],
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
    },
  ],
};