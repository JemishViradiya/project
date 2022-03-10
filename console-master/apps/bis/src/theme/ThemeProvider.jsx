import React, { memo } from 'react'

import { makeStyles, ThemeProvider as MuiThemeProvider } from '@material-ui/core'

import { useResponsiveMuiTheme } from '@ues/assets'

import overrides from './overrides'

const useCSSVariables = theme => makeStyles({ '@global': { ':root': theme.cssVariables } })()

const ThemeProvider = memo(({ children }) => {
  const theme = useResponsiveMuiTheme(overrides)

  useCSSVariables(theme)

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
})

export default ThemeProvider
