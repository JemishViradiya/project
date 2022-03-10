import React, { memo, StrictMode } from 'react'
import * as ReactDOM from 'react-dom'

import { CssBaseline, ThemeProvider } from '@material-ui/core'

import { loadI18n, useResponsiveMuiTheme } from '@ues/assets'

const Application: React.FC = memo(({ children }) => {
  const theme = useResponsiveMuiTheme()
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StrictMode>
  )
})

export const initApp = (children: React.ReactNode) => {
  loadI18n(process.env.NODE_ENV, {
    ns: ['session'],
    defaultNS: 'session',
  })

  ReactDOM.render(<Application>{children}</Application>, document.getElementById('root'))
}
