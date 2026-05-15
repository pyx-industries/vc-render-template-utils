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
  // The mappers below reach into multiformats' compiled output to resolve the
  // subpaths used by @uncefact/untp-utils under a CJS Jest setup. multiformats
  // ships its public API via its `exports` map with only an `import` condition,
  // which CJS Jest cannot follow. These mappers are coupled to the internal
  // dist layout, so a multiformats release that reshapes `dist/src/...` will
  // need updates here. A future move to an ESM Jest setup removes this
  // coupling entirely.
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
