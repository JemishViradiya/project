module.exports = {
  plugins: ['import', 'simple-import-sort'],
  settings: {
    'import/internal-regex': '^@ues/',
    'import/ignore': ['.(css|less|scss)$', 'react', 'prop-types'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx', '.svg'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json', 'libs/*/tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss'],
      },
    },
  },
  rules: {
    // import
    'import/no-named-as-default-member': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-amd': 'error',
    'import/no-duplicates': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/order': 'off',

    'no-restricted-imports': [
      'error',
      {
        paths: [{ name: '@material-ui/icons', message: '\nPlease ues @ues/assets icons.' }],
      },
    ],

    // import-sort
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything that does not start with a dot.
          ['^[^.]'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          ['^@material?\\w'],
          ['^@ues?\\w'],
          ['^@bg?\\w'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
        ],
      },
    ],
    'sort-imports': 'off',
  },
  overrides: [
    {
      files: ['*.stories.*', 'docs/**/*.sources.*'],
      rules: {
        'import/no-webpack-loader-syntax': 'off',
        'sonarjs/no-duplicate-string': 'off',
      },
    },
  ],
}
