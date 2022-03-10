import './cypress/support/coverage'
import './i18n'
import './commands'
import './data-wrapper'

import type { MockAction } from '@ues-data/shared-types'

export * from './i18n'
export * from './commands'
export * from './data-wrapper'

Cypress.on('window:before:load', contentWindow => {
  contentWindow.CYPRESS_CI_TESTING = true
  contentWindow.model = {
    _mocks: {},
    // data, error = ...params
    mockAll: ({ id, ...params }: MockAction) => {
      contentWindow.model._mocks[id] = params
    },
  }
})
