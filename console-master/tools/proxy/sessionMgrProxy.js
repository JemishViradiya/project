/* eslint-disable sonarjs/no-duplicate-string */
const { createProxyMiddleware } = require('http-proxy-middleware')

const defaultLogLevel = process.env.LOG_LEVEL || 'debug'

/**
 * @param {import('express').Application} app
 */
module.exports = (app, config) => {
  const { authorities, venueProxy, logLevel = defaultLogLevel, logger = console, defaultUrl } = config

  const proxyMiddleware = createProxyMiddleware('/uc/session/*', {
    autoRewrite: false,
    changeOrigin: false,
    followRedirects: false,
    hostRewrite: false,
    logLevel,
    logProvider: () => logger,
    prependPath: true,
    target: 'http://localhost:9090',
    xfwd: true,
  })

  app.use(proxyMiddleware)
}
