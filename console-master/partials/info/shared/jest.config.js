global.__JEST_NX_PROJECT = 'partials/info/shared'

module.exports = {
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: __dirname, configFile: './babel-jest.config.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../test-results/partials/info/shared',
  displayName: 'dlp/shared',
}
