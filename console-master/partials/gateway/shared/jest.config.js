global.__JEST_NX_PROJECT = 'partials/gateway/shared'

module.exports = {
  preset: '../../../jest.preset.js',
  displayName: 'gateway/shared',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: __dirname, configFile: './babel-jest.config.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../test-results/partials/gateway/shared',
}
