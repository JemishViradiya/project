import './i18n'
import './styles.scss'

import { create } from 'jss'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import DayUtils from '@date-io/dayjs'

import { createGenerateClassName, jssPreset, StylesProvider, ThemeProvider } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import App from './app'
import { persistor, store } from './store'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
})

const jss = create(jssPreset())
jss.options.insertionPoint = 'jss-insertion-point'

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#03A5EF',
    },
    error: {
      main: '#e10024',
    },
  },
})

;(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: `${
      window.location.hostname === 'localhost' || window.location.hostname.includes('dev-admin')
        ? '5f4d209ba2401e09850e4d05'
        : '5da51742f87c9308b76aed5d'
    }`,
  })

  ReactDOM.render(
    <StrictMode>
      <LDProvider>
        <StylesProvider jss={jss} generateClassName={generateClassName}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <MuiPickersUtilsProvider utils={DayUtils}>
                  <div>
                    <App />
                  </div>
                </MuiPickersUtilsProvider>
              </PersistGate>
            </Provider>
          </ThemeProvider>
        </StylesProvider>
      </LDProvider>
    </StrictMode>,
    document.getElementById('root'),
  )

  if (window.Cypress) {
    window.store = store
  }
})()
