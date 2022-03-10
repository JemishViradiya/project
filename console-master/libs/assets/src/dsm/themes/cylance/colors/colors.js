import { blue, green, grey, red, yellow } from '@material-ui/core/colors'

import { THEME_NAME } from '../name'
import bbBlue from './bbBlue'
import bbGreen from './bbGreen'
import bbGrey from './bbGrey'
import bbGreyDark from './bbGreyDark'
import bbRed from './bbRed'
import bbYellow from './bbYellow'
import charts from './charts'
// import commonColors from './common'
import cyBlueGrey from './cyBlueGrey'
import cyGreen from './cyGreen'
import greyDark from './greyDark'
import nav from './nav'

// const {
//   action: actionColors,
//   alert,
//   chipAlert: alertColors,
//   text: textColors,
//   divider: dividerColor,
//   link: linkColors,
//   white,
//   offwhite,
//   black,
//   util,
// } = commonColors

const CYLANCE_COLORS = {
  ...(THEME_NAME === 'BB_BLUE'
    ? {
        primary: bbGrey,
        secondary: bbBlue,
        green: bbGreen,
        blue: bbBlue,
        yellow: bbYellow,
        red: bbRed,
        grey: bbGrey,
        greyDark: bbGreyDark,
      }
    : {
        primary: cyBlueGrey,
        secondary: cyGreen,
        cyGreen: cyGreen,
        cyBlueGrey: cyBlueGrey,
        green: green,
        blue: blue,
        bbBlue,
        bbGrey,
        yellow: yellow,
        red: red,
        grey: grey,
        greyDark: greyDark,
      }),

  // action: { ...actionColors },
  // chipAlert: { ...alertColors },
  // text: { ...textColors },
  // link: { ...linkColors },
  // divider: dividerColor,
  // white,
  // offwhite,
  // black,
  // util,
  // alert,
  nav,
  charts,
}

export { CYLANCE_COLORS }
