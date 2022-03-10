import { create } from '@storybook/theming/create'

import logo from '../libs/pwa/assets/images/v1/favicon-32x32.png'

export default create({
  base: 'light',
  colorPrimary: '#1475dc',
  colorSecondary: '#1475dc',

  // UI
  appBg: '#fbfbfc',
  appContentBg: '#fefefe',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Roboto", "Open Sans", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'UES Storybook',
  brandImage: logo,
})
