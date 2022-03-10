/* eslint-disable @typescript-eslint/no-var-requires */
import '../../jest.setup'

jest.mock('@material-ui/core/styles', () => ({
  ...jest.requireActual('@material-ui/core/styles'),
  useTheme: jest.fn(() => {
    const { createCssVariablesTheme, createMuiTheme } = require('@ues/assets')
    const overrides = require('./src/theme/overrides')

    return createCssVariablesTheme(createMuiTheme({ colorScheme: 'light' }, overrides))
  }),
}))

global.requestIdleCallback = global.requestIdleCallback || (fn => setTimeout(fn, 300))
global.cancelIdleCallback = global.cancelIdleCallback || global.clearTimeout

// Ensure that we do *not* load Google Maps
window.google = {}

require('./src/i18n')

global.T = (ns = ['bis/standalone/common', 'bis/shared']) => require('i18next').getFixedT(null, ns)

jest.mock('libs/data/shared/src/lib/mockContext', () => ({
  useMock: jest.fn(() => false),
}))

global.mockModule = function mockModule(req) {
  const mod = req.default || req
  return Object.assign(jest.fn(mod), mod)
}

global.doMockModule = function mockModule(mock, mockFn) {
  const fn = mockFn()
  mock.mockReset().mockImplementation(fn)
  Object.assign(mock, fn)
}
