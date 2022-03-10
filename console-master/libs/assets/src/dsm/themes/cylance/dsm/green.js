/* eslint-disable sonarjs/no-duplicate-string */
import { blue, green, grey, red } from '@material-ui/core/colors'

import cyBlueGrey from '../colors/cyBlueGrey'
import cyGreen from '../colors/cyGreen'
import { base, common } from './base'

const light = {
  type: 'light',
  primary: {
    light: cyBlueGrey[300],
    main: cyBlueGrey[500],
    dark: cyBlueGrey[700],
    contrastText: base.common.white,
  },
  secondary: {
    light: cyGreen[300],
    main: cyGreen[500],
    dark: cyGreen[700],
    contrastText: base.common.white,
  },
  background: {
    paper: base.common.white,
    background: base.common.white,
    default: base.common.white,
    body: '#f9f9f9',
  },
  divider: grey['A100'],
  error: {
    light: red[300],
    main: '#f30034',
    dark: red[700],
    contrastText: base.common.white,
  },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L29
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: cyBlueGrey[500],
    // The color of an hovered action.
    hover: cyBlueGrey[500],
    hoverOpacity: 0.08,
    // The color of a selected action.
    selected: cyBlueGrey[700],
    // The color of a disabled action.
    disabled: grey[500],
    // The background color of a disabled action.
    disabledBackground: grey[200],
  },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L10
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: grey[800],
    // Secondary text.
    secondary: grey[600],
    // Disabled text have even lower visual prominence.
    disabled: grey[500],
    // Text hints.
    hint: grey[600],
  },
  // textField: { borderColor: '#aeb5bb' },
  // borderColor: '#eaecee',
  alert: {
    error: '#ffeaed',
    errorBorder: '#cb2946',
    warning: '#fffde6',
    warningBorder: '#ffb702',
    info: blue[50],
    infoBorder: blue[700],
    success: green[50],
    successBorder: green[700],
  },
  chipAlert: {
    critical: '#ff3670',
    high: '#cb2946',
    medium: '#ff701c',
    low: '#fdd714',
    secure: '#008957',
    info: blue[500],
  },
  link: {
    default: {
      main: '#1a92d1',
      hover: '#0377bd',
      active: '#0070a5',
    },
    secondary: {
      main: '#757575',
      hover: '#424242',
      active: '#000000',
    },
  },
  util: {
    success: green[500],
    warning: '#ff9800',
    info: blue[500],
    error: '#f30034',
  },
  ...common,
}
const dark = {
  type: 'dark',
  primary: {
    light: cyBlueGrey[700],
    main: cyBlueGrey[500],
    dark: cyBlueGrey[300],
    contrastText: base.common.black,
  },
  secondary: {
    light: cyGreen[700],
    main: cyGreen[500],
    dark: cyGreen[300],
    contrastText: base.common.black,
  },
  background: {
    paper: base.common.black,
    background: base.common.black,
    default: base.common.black,
    body: '#060606',
  },
  error: {
    light: red[300],
    main: '#f30034',
    dark: red[700],
    contrastText: base.common.black,
  },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L29
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: cyBlueGrey[500],
    // The color of an hovered action.
    hover: cyBlueGrey[500],
    hoverOpacity: 0.08,
    // The color of a selected action.
    selected: cyBlueGrey[300],
    // The color of a disabled action.
    disabled: grey[500],
    // The background color of a disabled action.
    disabledBackground: grey[800],
  },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L10
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: grey[200],
    // Secondary text.
    secondary: grey[400],
    // Disabled text have even lower visual prominence.
    disabled: 'rgba(255, 255, 255, 0.38)',
    // Text hints.
    hint: grey[400],
  },
  // borderColor: '#344554',
  // textField: { borderColor: '#4d5b67' },
  alert: {
    error: '#140003',
    errorBorder: '#cb2946',
    warning: '#1a1700',
    warningBorder: '#ffb702',
    info: blue[50],
    infoBorder: blue[700],
    success: green[50],
    successBorder: green[700],
  },
  chipAlert: {
    critical: '#ff3670',
    high: '#cb2946',
    medium: '#ff701c',
    low: '#fdd714',
    secure: '#008957',
    info: blue[500],
  },
  link: {
    default: {
      main: '#1a92d1',
      hover: '#0377bd',
      active: '#0070a5',
    },
    secondary: {
      main: '#757575',
      hover: '#424242',
      active: '#000000',
    },
  },
  util: {
    success: '#4caf70',
    warning: '#ff9800',
    info: '#2196f3',
    error: '#f30034',
  },
  ...common,
}

export { base, light, dark }
