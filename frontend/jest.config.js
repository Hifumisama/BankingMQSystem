module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: {
    '^.+\\.(ts|js|html|svg)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
  },
  collectCoverage: true,
  coverageReporters: ['html', 'text'],
  coverageDirectory: 'coverage/jest',
}; 