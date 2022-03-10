global.__JEST_NX_PROJECT = 'libs/data/epp'

module.exports = {
  preset: '../../../jest.preset.js',
  displayName: 'data/epp',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/data/epp',
}
