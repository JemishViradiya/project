global.__JEST_NX_PROJECT = 'libs/data/persona'

module.exports = {
  displayName: 'data/persona',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/data/persona',
}
