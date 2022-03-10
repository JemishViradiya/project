const tsExtends = process.env.VSCODE_CWD ? ['./vscode.eslintrc.js'] : ['plugin:@nrwl/nx/typescript']
const jsExtends = process.env.VSCODE_CWD ? ['./vscode.eslintrc.js'] : ['plugin:@nrwl/nx/javascript']

module.exports = {
  overrides: [
    {
      files: ['*.ts'],
      extends: [...tsExtends, './react-lib.eslintrc.js'],
      rules: {},
    },
    {
      files: ['*.js'],
      extends: [...jsExtends, './react-lib.eslintrc.js'],
      rules: {},
    },
    {
      files: ['*.tsx'],
      extends: [...tsExtends, './react.eslintrc.js'],
    },
    {
      files: ['*.jsx'],
      extends: [...jsExtends, './react.eslintrc.js'],
    },
  ],
}
