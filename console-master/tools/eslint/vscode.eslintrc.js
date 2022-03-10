const app_root = require('@nrwl/tao/src/utils/app-root')

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    tsconfigRootDir: app_root.appRootPath,
  },
  extends: ['eslint:recommended'],
}
