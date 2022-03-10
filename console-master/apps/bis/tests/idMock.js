// This is intended to replace identity-obj-proxy
// but fix https://github.com/facebook/jest/issues/7009
let proxy
const handler = {
  get: (obj, prop) => {
    if (prop === '__esModule') {
      return true
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
