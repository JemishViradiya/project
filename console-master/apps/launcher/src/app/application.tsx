import React, { memo, StrictMode, Suspense } from 'react'
import { HashRouter } from 'react-router-dom'

import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'

import { useResponsiveMuiTheme } from '@ues/assets'
import { Loading } from '@ues/behaviours'

const AppShell: React.FC = memo(({ children }) => {
  const loading = (
    <main>
      <Loading />
    </main>
  )

  return (
    <HashRouter>
      <Suspense fallback={loading}>{children}</Suspense>
    </HashRouter>
  )
})
AppShell.displayName = 'AppShell'

const App: React.FC = memo(({ children }) => {
  const theme = useResponsiveMuiTheme()
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppShell>{children}</AppShell>
      </ThemeProvider>
    </StrictMode>
  )
})
App.displayName = 'LauncherApplication'

export default App
