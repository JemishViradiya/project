import { coarse } from './coarse'
import { CYLANCE_COLORS } from './colors'
import { DARK_THEME } from './dark'
import { fine } from './fine'
import { LIGHT_THEME } from './light'
import { THEME_NAME } from './name'
import * as OVERRIDES from './overrides'
import { shadows } from './shadows'
import { cylanceSpacing } from './spacing'
import { typography } from './typography'

const THEME = {
  base: {
    name: THEME_NAME,
    typography,
    props: {
      colors: { ...CYLANCE_COLORS },
      // MuiButton: { variant: 'contained' },
      MuiButtonBase: { disableRipple: true },
      MuiButtonGroup: { disableRipple: true },
      MuiAppBar: { color: 'default' },
      MuiLink: { color: 'inherit' },
      MuiTableRow: { hover: true },
      MuiRadio: { color: 'secondary' },
      MuiTable: { stickyHeader: true },
      MuiTextField: { variant: 'filled' },
      MuiListItem: { className: 'MuiListItem-theme' },
      MuiListItemText: { className: 'MuiListItemText-theme' },
      MuiListItemIcon: { className: 'MuiListItemIcon-theme' },
      MuiSvgIcon: { className: 'MuiSvgIcon-theme' },
      MuiCollapse: { className: 'MuiCollapse-theme' },
      MuiList: { className: 'MuiList-theme' },
      MuiTypography: { variant: 'body2' },
      // MuiDialog: { fullWidth: true, scroll: 'paper' },
      // MuiSwitch: { color: 'primary' },
      // MuiTab: { disableRipple: true },
      // MuiTabs: { indicatorColor: 'primary', fontcolor: 'primary' },
    },
    // sets border radius for cards, buttons, etc.
    shape: { borderRadius: 2 },
    spacing: cylanceSpacing,
  },
  light: LIGHT_THEME,
  dark: DARK_THEME,
  coarse,
  fine,
  overrides: OVERRIDES,
  shadows,
  zIndex: {
    appBar: 2000, // 1100
    drawer: 2200, // 1200
    mobileStepper: 1800, // 1000
    // override the z-index for the notification snackbars and modal
    // so they don't get cut off in Venue
    modal: 10000,
    snackbar: 10100,
    speedDial: 1900, // 1050
    tooltip: 2800, // 1500
  },
}

export { THEME }
