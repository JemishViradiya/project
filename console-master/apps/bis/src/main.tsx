import './setup'
import 'setimmediate' // we need this here as polyfills may load later than main file which uses setImmediate to do some initial stuff
import './config'

import React from 'react'
import ReactDOM from 'react-dom'

import { UesRoutes } from '@ues-bis/settings'
import isStandalone from '@ues-bis/shared/isStandalone'

const standalone = isStandalone()

if (standalone === true) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const App = require('./app/standalone').default

  ReactDOM.render(<App />, document.getElementById('root'))
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initializeApplication } = require('@ues-behaviour/app-shell')

  initializeApplication(<UesRoutes />)
}
