/* eslint-disable sonarjs/no-duplicate-string */
import deepmerge from 'deepmerge'

import { createTheme } from '@material-ui/core'

const createMuiThemeFactory = muiTheme => (
  {
    colorScheme = 'light', // light | dark
    // color = 'full', // full | limited | none
    motion = undefined, // undefined | reduce
    pointer = 'fine', // fine | coarse
  },
  { light: overrideLight = {}, dark: overrideDark = {}, ...base } = {},
) => {
  const ctx = {}
  if (motion === 'reduce') {
    // ctx.props = { MuiButtonBase: { disableRipple: true } }
    ctx.transitions = {
      duration: {
        complex: 0,
        enteringScreen: 0,
        leavingScreen: 0,
        shortest: 0,
        shorter: 0,
        short: 0,
        standard: 0,
      },
      easing: {
        easeInOut: 'step-start',
        easeOut: 'step-start',
        easeIn: 'step-start',
        sharp: 'step-start',
      },
      create: () => 'none',
      getAutoHeightDuration: () => 0,
    }
  }
  // if (color !== 'full') {
  //   ctx.contrastThreshold = 6
  //   ctx.tonalOffset = 0.5
  // }

  const pointerCtx = pointer === 'coarse' ? muiTheme.coarse : muiTheme.fine
  Object.assign(ctx, pointerCtx)
  const spacing = pointerCtx.spacing
  ctx.spacing = factor => factor * spacing
  ctx.palette = { pointer, motion }

  const theme = createTheme(
    // muiTheme[colorScheme],

    [muiTheme.base, base, muiTheme[colorScheme], colorScheme === 'light' ? overrideLight : overrideDark, ctx].reduce(
      (agg, item) => deepmerge(agg, item),
      {},
    ),
  )

  Object.assign(theme.overrides, muiTheme.overrides.create(muiTheme.overrides, theme))

  Object.assign(theme.shadows, muiTheme.shadows(theme))

  return theme
}

export { createMuiThemeFactory }
