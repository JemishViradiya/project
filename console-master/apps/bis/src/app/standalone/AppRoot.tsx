import '../../auth/saga'
import '../../i18n'

import React, { Suspense } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'

import CssBaseline from '@material-ui/core/CssBaseline'
import { StylesProvider } from '@material-ui/core/styles'

import { ResponsiveDrawerProvider } from '@ues-behaviour/nav-drawer'

import Authenticator from '../../auth/components/Authenticator'
import { store } from '../../ReduxSetup'
import ThemeProvider from '../../theme/ThemeProvider'
import StandaloneApp from './App'

const StandaloneAppRoot: React.FC = () => {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <StylesProvider injectFirst>
          <ThemeProvider>
            <CssBaseline />
            <Suspense fallback="">
              <ResponsiveDrawerProvider responsive={true}>
                <Router>
                  <StandaloneApp />
                </Router>
                <Authenticator />
              </ResponsiveDrawerProvider>
            </Suspense>
          </ThemeProvider>
        </StylesProvider>
      </ReduxProvider>
    </React.StrictMode>
  )
}

export default StandaloneAppRoot
