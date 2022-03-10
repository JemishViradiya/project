global.__JEST_NX_PROJECT = 'partials/info/policy'

module.exports = {
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: __dirname, configFile: './babel-jest.config.json' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!@hookform/*).+\\.[t|j]sx?$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../test-results/partials/info/policy',
  displayName: 'dlp/policy',
}
