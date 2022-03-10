process.env.NODE_CONFIG_ENV = 'spec'

const path = require('path')
const { isMainThread } = require('worker_threads')

const { config } = require('../../../codecept.base')

/** @type {import('http').Server} */
let server

exports.config = Object.assign(config('behaviour/shared-e2e'), {
  tests: './src/codeceptjs/integration/**/*.spec.ts',
  bootstrapAll: bootstrap,
  teardownAll: teardown,
  bootstrap: () => isMainThread && bootstrap(),
  teardown: () => isMainThread && teardown(),
})

async function bootstrap() {
  const express = require('express')
  const app = express()
  await new Promise(resolve => {
    server = app
      .use(
        express.static(path.join(__dirname, 'assets', 'webpage'), {
          redirect: false,
          extensions: ['html'],
          index: ['index.html'],
        }),
      )
      .listen(3344, resolve)
  })
}

async function teardown() {
  if (server) await new Promise(resolve => server.close(() => resolve))
}
