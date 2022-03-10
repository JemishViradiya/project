const path = require('path')

const {
  moduleFileExtensions,
  coverageReporters,
  reporters,
  collectCoverageFrom,
  ci,
  collectCoverage,
  colors,
} = require('./jest.preset')
const project = global.__JEST_NX_PROJECT

module.exports = {
  moduleFileExtensions,
  coverageReporters,
  reporters,
  collectCoverageFrom,
  ci,
  collectCoverage,
  colors,
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.pact.js')],
  testEnvironment: 'node',
  testMatch: ['**/+(*.)+(spec.pact).+(ts|js)?(x)'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: __dirname, configFile: './babel-jest.config.json' }],
  },
  coverageDirectory: path.resolve(__dirname, 'test-results', project),
  moduleNameMapper: {
    '^lodash-es': path.resolve(__dirname, './node_modules/lodash'),
    '^@ues-data/network$': require.resolve('./libs/pwa/src/network/index.ts'),
    '^@ues-data/shared$': require.resolve('./libs/data/shared/src/index.ts'),
    '^@ues-data/shared-types$': require.resolve('./libs/data/shared/src/types/index.ts'),
    '^@ues-data/shared-pact$': require.resolve('./libs/data/shared/config.pact.ts'),
  },
  globals: {
    __JEST_NX_PROJECT,
  },
}
