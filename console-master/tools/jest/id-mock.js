// This is intended to replace identity-obj-proxy
// but fix https://github.com/facebook/jest/issues/7009
let proxy
/** @type {ProxyHandler} */
const handler = {
  get: (obj, prop, receiver) => {
    if (prop === '__esModule') {
      return false
    } else if (prop === 'default') {
      // emulate esModuleInterop: true
      return receiver
    } else if (prop === Symbol.toPrimitive) {
      return hint => {
        if (hint === 'number') {
          return 0
        }
        if (hint === 'string') {
          return 'mock'
        }
        return true
      }
    } else if (prop === '_isMockFunction') {
      return false
    }
    return prop
  },
}

proxy = new Proxy({}, handler)
module.exports = proxy
