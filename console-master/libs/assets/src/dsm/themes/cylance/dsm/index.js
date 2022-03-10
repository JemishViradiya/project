import { THEME_NAME } from '../name'
import * as BB_BLUE from './blue'
import * as CY_GREEN from './green'

const { light, dark, base } = THEME_NAME === 'BB_BLUE' ? BB_BLUE : CY_GREEN

export { BB_BLUE, CY_GREEN, light, dark, base }
