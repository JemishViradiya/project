const fs = require('fs')

const appsRawData = fs.readFileSync('./libs/api/src/ui/apps', 'utf8')
const apps = JSON.stringify(JSON.parse(appsRawData))

const theme = {}

Object.defineProperty(global, 'apps', {
  writable: true,
  value: apps,
})

Object.defineProperty(window, 'theme', {
  writable: true,
  value: theme,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

if (!window.fetch) {
  window.fetch = require('node-fetch')
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    disconnect() {}
  }
}

window.ResizeObserver = function () {
  return { observe: () => {}, unobserve: () => {}, disconnect: () => {} }
}

jest.setMock('@ues/service-worker', require('./libs/pwa/src/client/__mocks__'))
