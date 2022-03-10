/* eslint-disable sonarjs/no-duplicate-string */
import bbBlue from '../colors/bbBlue'
import bbGreen from '../colors/bbGreen'
import bbGrey from '../colors/bbGrey'
import bbRed from '../colors/bbRed'
import bbYellow from '../colors/bbYellow'
import { base as Base, common } from './base'

const base = {
  ...Base,
  shadows: { umbraOpacity: 0.02, penumbraOpacity: 0.014, ambientShadowOpacity: 0.012 },
  divider: bbGrey[100],
}

const light = {
  type: 'light',
  primary: {
    light: bbGrey[100],
    main: bbGrey[200],
    dark: bbGrey[300],
    contrastText: bbGrey[700],
    background: { selected: bbGrey[200] },
    text: { selected: bbGrey[700] },
  },
  secondary: {
    light: bbBlue[300],
    main: bbBlue[700],
    dark: bbBlue[900],
    contrastText: base.common.white,
    background: { selected: '#edf4fc' },
    text: { selected: bbBlue[900] },
  },
  background: {
    paper: base.common.white,
    background: base.common.white,
    default: base.common.white,
    body: '#f4f5f6',
  },
  info: { main: bbBlue[700], light: bbBlue[700], dark: bbBlue[900], contrastText: base.common.white },
  success: { main: bbGreen[700], light: bbGreen[300], dark: bbGreen[900], contrastText: base.common.white },
  warning: { main: bbYellow[700], light: bbYellow[300], dark: bbYellow[900], contrastText: base.common.white },
  error: { main: bbRed[700], light: bbRed[300], dark: bbRed[900], contrastText: base.common.white },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L29
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: bbBlue[700],
    // The color of an hovered action.
    hover: bbGrey[700],
    hoverOpacity: 0.08,
    // The color of a selected action.
    selected: bbBlue[700],
    // The color of a disabled action.
    disabled: bbGrey[200],
    // The background color of a disabled action.
    disabledBackground: base.common.white,
  },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L10
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: bbGrey[700],
    // Secondary text.
    secondary: bbGrey[600],
    // Disabled text have even lower visual prominence.
    disabled: bbGrey[400],
    // Text hints.
    hint: bbGrey[500],
  },
  textField: { borderColor: bbGrey[300] },
  borderColor: bbGrey[300],
  borderColorTable: bbGrey[200],
  alert: {
    error: bbRed[50],
    errorBorder: bbRed[700],
    warning: bbYellow[50],
    warningBorder: bbYellow[700],
    info: bbBlue[50],
    infoBorder: bbBlue[700],
    success: bbGreen[50],
    successBorder: bbGreen[700],
  },
  chipAlert: {
    critical: '#ff3670',
    high: bbRed[700],
    medium: bbYellow[700],
    low: bbGreen[700],
    info: bbBlue[700],
    secure: bbGreen[700],
    color: base.common.white,
  },
  link: {
    default: {
      main: bbBlue[700],
      hover: bbBlue[900],
      active: bbBlue[900],
    },
    secondary: {
      main: bbRed[700],
      hover: bbRed[900],
      active: bbRed[900],
    },
  },
  util: {
    success: bbGreen[700],
    warning: bbYellow[700],
    info: bbBlue[700],
    error: bbRed[700],
  },
  ...common,
}

const dark = {
  type: 'dark',
  primary: {
    main: bbGrey[300],
    dark: bbGrey[500],
    light: bbGrey[200],
    contrastText: bbGrey[800],
  },
  secondary: {
    main: bbBlue[300],
    dark: bbBlue[500],
    light: bbBlue[100],
    contrastText: bbGrey[800],
  },
  background: {
    paper: bbGrey[900],
    background: base.common.black,
    default: base.common.black,
    body: base.common.black,
    //default: base.common.blackk,
    //filledInput: bbGrey[900],
    //paper: bbGrey[900],
    //snackbar: '#344554',
    //tooltip: '#4d5b67',
    //backdrop: '#fbfbfc80',
  },
  info: { main: bbBlue[300], light: bbBlue[500], dark: bbBlue[100], contrastText: bbGrey[800] },
  success: { main: bbGreen[300], dark: bbGreen[500], light: bbGreen[100], contrastText: bbGrey[900] },
  warning: { main: bbYellow[300], dark: bbYellow[500], light: bbYellow[100], contrastText: bbGrey[800] },
  error: { main: bbRed[300], dark: bbRed[500], light: bbRed[100], contrastText: bbGrey[900] },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L29
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: bbBlue[300],
    // The color of an hovered action.
    hover: bbGrey[300],
    hoverOpacity: 0.2,
    // The color of a selected action.
    selected: bbGrey[300],
    // The color of a disabled action.
    disabled: bbGrey[900],
    // The background color of a disabled action.
    disabledBackground: bbGrey[900],
  },
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L10
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: bbGrey[200],
    // Secondary text.
    secondary: bbGrey[300],
    // Disabled text have even lower visual prominence.
    disabled: bbGrey[400],
    // Text hints.
    hint: bbGrey[500],
  },
  borderColor: bbGrey[600],
  borderColorTable: bbGrey[700],
  textField: { borderColor: bbGrey[600] },
  alert: {
    error: '#d323294d',
    errorBorder: bbRed[300],
    warning: '#bd8d034d',
    warningBorder: bbYellow[300],
    info: '#1475DC4D',
    infoBorder: bbBlue[300],
    success: '#0088584D',
    successBorder: bbGreen[300],
  },
  chipAlert: {
    critical: '#ff3670',
    high: bbRed[300],
    medium: bbYellow[300],
    low: bbGreen[300],
    info: bbBlue[300],
    secure: bbGreen[300],
    color: base.common.black,
  },
  link: {
    default: {
      main: bbBlue[300],
      hover: bbBlue[500],
      active: bbBlue[500],
    },
    secondary: {
      main: bbGrey[300],
      hover: bbGrey[100],
      active: bbGrey[100],
    },
  },
  util: {
    success: bbGreen[300],
    warning: bbYellow[300],
    info: bbBlue[300],
    error: bbRed[300],
  },
  ...common,
}

export { base, light, dark }
