global.__JEST_NX_PROJECT = 'apps/bis'

module.exports = {
  preset: '../../jest.preset.js',
  displayName: 'bis',
  clearMocks: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
}
