import { CYLANCE_COLORS as colors } from './colors'
import { base, dark } from './dsm'

const palette = {
  type: 'dark',
  ...base,
  ...colors,
  ...dark,
  logicalGrey: colors.greyDark,
}

const DARK_THEME = {
  palette,
}

export { DARK_THEME }
