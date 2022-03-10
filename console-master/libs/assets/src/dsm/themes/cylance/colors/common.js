import { blue, grey } from '@material-ui/core/colors'

import cyBlueGrey from './cyBlueGrey'

const commonColors = {
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L10
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: grey[800],
    // Secondary text.
    secondary: grey[600],
    // Disabled text have even lower visual prominence.
    disabled: 'rgba(0, 0, 0, 0.38)',
    // Text hints.
    hint: grey[600],
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
  alert: {
    error: '#ffeaed',
    errorBorder: '#cb2946',
    warning: '#fffde6',
    warningBorder: '#ffb702',
  },
  chipAlert: {
    critical: '#ff3670',
    high: '#cb2946',
    medium: '#ff701c',
    low: '#fdd714',
    secure: '#008957',
    info: blue[500],
  },
  divider: grey['A100'],
  white: '#fff',
  offwhite: 'rgba(255, 255, 255, 0.84)',
  black: '#000',
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
}

export default commonColors
