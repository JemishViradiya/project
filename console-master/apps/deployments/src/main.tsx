import './setup'

import { initializePartialVenue } from '@ues-behaviour/app-shell'

import App from './app/app'

initializePartialVenue(App, { app: 'deployments' })
