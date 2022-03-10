/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

const docsOptions = {
  configureJSX: true,
  babelOptions: {},
}

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-notes/register-panel',
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: true,
        backgrounds: false,
        controls: true,
        docs: {
          configureJSX: true,
          // babelOptions: {}
          sourceLoaderOptions: {
            parser: 'typescript',
            injectStoryParameters: false,
          },
        },
        viewport: false,
        toolbars: true,
      },
    },
    '@storybook/addon-links',
    '@nrwl/react/plugins/storybook',
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: require('./webpack-config'),
}
