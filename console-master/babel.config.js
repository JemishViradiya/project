module.exports = {
  // caller: {
  //   isModern: false,
  // },
  //  strictMode: true,
  sourceType: 'unambiguous',
  babelrcRoots: ['*'],
  presets: [[require.resolve('@nrwl/react/babel'), { runtime: 'automatic' }], require.resolve('@babel/preset-typescript')],
  plugins: [
    require.resolve('babel-plugin-macros'),
    // Must use legacy decorators to remain compatible with TypeScript.
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
    [require.resolve('@babel/plugin-proposal-private-methods'), { loose: true }],
    [require.resolve('@babel/plugin-proposal-private-property-in-object'), { loose: true }],
  ],
  overrides: [
    // Convert `const enum` to `enum`. The former cannot be supported by babel
    // but at least we can get it to not error out.
    {
      test: /\.tsx?$/,
      plugins: [
        [
          require.resolve('babel-plugin-const-enum'),
          {
            transform: 'constObject',
          },
        ],
      ],
    },
  ],
}
