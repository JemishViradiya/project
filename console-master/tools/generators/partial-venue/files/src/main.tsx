import './setup'

import { initializeApplication, initializePartialVenue } from '@ues-behaviour/app-shell'

import App from './app/app'

if (window.isInVenue) {
  initializePartialVenue(App, { app: '<%= name %>' })
} else {
  initializeApplication(App)
}
