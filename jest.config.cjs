module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@uncefact/untp-utils|multiformats)/)',
  ],
  moduleNameMapper: {
    '^multiformats/hashes/digest$':
      '<rootDir>/node_modules/multiformats/dist/src/hashes/digest.js',
    '^multiformats/hashes/sha2$':
      '<rootDir>/node_modules/multiformats/dist/src/hashes/sha2.js',
    '^multiformats/bases/base58$':
      '<rootDir>/node_modules/multiformats/dist/src/bases/base58.js',
    '^multiformats/bases/base64$':
      '<rootDir>/node_modules/multiformats/dist/src/bases/base64.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
