import { THEME_NAME } from '../name'
import { BB_TYPOGRAPHY } from './blue'
import { CYLANCE_TYPOGRAPHY } from './green'

const typography = THEME_NAME === 'BB_BLUE' ? BB_TYPOGRAPHY : CYLANCE_TYPOGRAPHY

export { BB_TYPOGRAPHY, CYLANCE_TYPOGRAPHY, typography }
