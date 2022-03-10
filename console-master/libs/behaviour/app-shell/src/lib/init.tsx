import React from 'react'
import ReactDOM from 'react-dom'
import type { PartialRouteObject } from 'react-router'

import { registerTelemetry } from '@ues-data/shared'
import { loadI18n } from '@ues/assets/i18n'

import DefaultApplication from './Application'
import Partial from './Partial'
import DefaultVenueApplication from './VenueApplication'

export const initializeApplication = (children: React.ReactNode | React.ReactNode[], Application = DefaultApplication) => {
  loadI18n(process.env.NODE_ENV, {
    ns: ['navigation', 'formats'],
    defaultNS: '',
  })
  registerTelemetry()

  ReactDOM.render(<Application>{children}</Application>, document.getElementById('root'))
}

export const initializePartialVenue = (
  children: React.ReactNode | React.ReactNode[],
  { app }: { app: string },
  Application = DefaultVenueApplication,
) => {
  loadI18n(process.env.NODE_ENV, {
    ns: ['navigation', 'formats'],
    defaultNS: '',
    prefix: __webpack_public_path__.replace(/\/[^/]*$/, '').replace(/\/[^/]*$/, ''),
  })
  registerTelemetry()

  ReactDOM.render(<Application>{children}</Application>, document.getElementById(`root-${app}`) || document.getElementById('root'))
}

export const initializePartial = (routes: Record<string, PartialRouteObject>, Application = DefaultApplication) => {
  loadI18n(process.env.NODE_ENV, {
    ns: ['navigation', 'formats'],
    defaultNS: '',
  })

  ReactDOM.render(
    <Application>
      <Partial routes={routes} />
    </Application>,
    document.getElementById('root'),
  )
}
