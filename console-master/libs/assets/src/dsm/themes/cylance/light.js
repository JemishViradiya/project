import { CYLANCE_COLORS as colors } from './colors'
import { base, light } from './dsm'

const palette = {
  type: 'light',
  ...base,
  ...colors,
  ...light,
  logicalGrey: colors.grey,
}

const LIGHT_THEME = {
  palette,
}

export { LIGHT_THEME }
