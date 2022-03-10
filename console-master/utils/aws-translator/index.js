process.env.DEBUG = process.env.DEBUG || 'translator:info,translator:error,translator:warn'
process.env.TS_NODE_PROJECT = require('path').join(__dirname, 'tsconfig.app.json')

require('ts-node/register')

const translator = require('./translator').default

translator().catch(error => {
  console.error(error.stack || error)
  process.exit(1)
})
