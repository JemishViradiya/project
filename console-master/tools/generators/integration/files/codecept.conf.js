const { config } = require('../../../codecept.base')

exports.config = Object.assign(config('<%= fullName %>'), {
  tests: './src/**/*.spec.ts',
})
