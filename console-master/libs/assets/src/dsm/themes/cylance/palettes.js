import { CYLANCE_COLORS } from './colors'

const CYLANCE_PALETTE = {
  primary: {
    light: CYLANCE_COLORS.cyBlueGrey[300],
    main: CYLANCE_COLORS.cyBlueGrey[500],
    dark: CYLANCE_COLORS.cyBlueGrey[700],
    contrastText: CYLANCE_COLORS.white,
  },
  secondary: {
    light: CYLANCE_COLORS.cyGreen[300],
    main: CYLANCE_COLORS.cyGreen[500],
    dark: CYLANCE_COLORS.cyGreen[700],
    contrastText: CYLANCE_COLORS.white,
  },
  error: {
    light: CYLANCE_COLORS.red[300],
    main: '#f30034',
    dark: CYLANCE_COLORS.red[700],
    contrastText: CYLANCE_COLORS.white,
  },
  background: {
    paper: CYLANCE_COLORS.white,
    background: CYLANCE_COLORS.white,
    default: CYLANCE_COLORS.white,
  },
  common: {
    white: CYLANCE_COLORS.white,
    black: CYLANCE_COLORS.black,
  },
  grey: { ...CYLANCE_COLORS.grey },
  action: { ...CYLANCE_COLORS.action },
  text: { ...CYLANCE_COLORS.text },
  divider: CYLANCE_COLORS.divider,
}

export { CYLANCE_PALETTE }
