const nxPreset = require('@nrwl/jest/preset')
const path = require('path')
const os = require('os')

process.env.NODE_ENV = 'test'
process.env.TZ = 'America/New_York'

const isCI = process.env.CI || process.argv.indexOf('--ci') !== -1
const project = global.__JEST_NX_PROJECT
const maxWorkers = Math.min(parseInt(process.env.JEST_PARALLEL || os.cpus().length.toString(), 10), 8)

const ciConfig = {
  ci: true,
  collectCoverage: true,
  colors: true,
  detectOpenHandles: false,
}

const baseEnv = process.env.NX_BASE
const nxBase = isCI ? false : baseEnv ? baseEnv.slice(7) : false
ciConfig.changedSince = nxBase

const reporters = ['default']
const ciReporters = [
  ...reporters,
  [
    'jest-junit',
    {
      outputDirectory: `test-results/${project}`,
      outputName: `junit.xml`,
      suiteName: path.basename(project),
    },
  ],
  [
    'jest-html-reporter',
    {
      pageTitle: `Test Report (${project})`,
      includeConsoleLog: true,
      includeFailureMsg: true,
      outputPath: `test-results/${project}/junit.html`,
    },
  ],
]
const resolveCacheDir = () => {
  if (!isCI) {
    return path.resolve(__dirname, 'node_modules', '.cache')
  }
  return process.env.CACHE_DIR || process.env.XDG_CACHE_HOME || '/usr/local/share/.cache/enterprise-ues-console'
}
const cacheDirectory = path.resolve(resolveCacheDir(), 'jest')

console.warn('> jest [workers=%s] [cacheDirectory=%s] [base=%s]', maxWorkers, cacheDirectory, nxBase)
module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: project, configFile: path.resolve(__dirname, 'babel-jest.config.json') }],
  },
  transformIgnorePatterns: ['node_modules/(?!latlon-geohash)'],
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  moduleNameMapper: {
    '\\.(less|module.css)$': path.resolve(__dirname, 'tools/jest/id-mock.js'),
    '\\.(css|sass|scss)$': path.resolve(__dirname, 'tools/jest/style-mock.js'),
    '^lodash-es$': require.resolve('lodash'),
    '^lodash(?:-es)?/(.*)': path.resolve(__dirname, 'node_modules', 'lodash', '$1.js'),
    '^@ues/assets$': require.resolve('./libs/assets/src/index.ts'),
    '^@ues/behaviours$': require.resolve('./libs/behaviours/src/index.ts'),
    '^@material-ui/core/esm/(.*)$': path.resolve(__dirname, 'node_modules/@material-ui/core/$1'),
    '^core-js-pure$': 'core-js/$1',
  },
  coverageReporters: ['cobertura', 'json'].concat(isCI ? [] : ['html', 'text']),
  coverageDirectory: path.resolve(__dirname, 'test-results', project),
  collectCoverageFrom: ['./src/**'],
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
  globals: { __webpack_public_path__: true },
  ...(isCI ? ciConfig : {}),
  reporters: isCI ? ciReporters : reporters,
  maxWorkers,
  runInBand: false,
  cache: true,
  cacheDirectory,
}
