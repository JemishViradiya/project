import React, { Suspense } from 'react'

import { CssBaseline, MuiThemeProvider } from '@material-ui/core'

import { useResponsiveMuiTheme } from '@ues/assets'

function MuiResponsiveThemeDecorator(Story, ctx) {
  const theme = useResponsiveMuiTheme()
  window.MuiTheme = theme
  return (
    <Suspense fallback={'loading'}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={'loading'}>
          <Story {...ctx} />
        </Suspense>
      </MuiThemeProvider>
    </Suspense>
  )
}

export default () => MuiResponsiveThemeDecorator
