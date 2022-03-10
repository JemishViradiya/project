const path = require('path')
const Config = require('config')
const express = require('express')
const cors = require('cors')
const debug = require('debug')

const sessionMgrProxy = require('../proxy/sessionMgrProxy')
const i18nDevServer = require('./i18nDevServer')
const apiDevServer = require('./apiDevServer')

const debugLogger = debug('uc:tools:webpack:devServer')

module.exports = ({ publicPath, contentBase, staticOptions, isCypressCI }, { port }) => {
  const xPoweredBy = {
    app: `WebpackDevServer${publicPath}`,
    proxy: 'WebpackDevServer/proxy',
    static: 'WebpackDevServer/static',
    express: 'WebpackDevServer/express',
  }

  const log = console

  const { domain, allowedOrigins } = Config
  const baseDomain = `.${domain.split('.').slice(1).join('.')}`

  const domainHeader = `${domain}:${port}`
  const hmrSocketPath = `${publicPath}/sockjs-node`

  const allowedAuthorities = new Set(Object.keys(Config.authorities))

  let proxyConfig = require('../../proxy.conf.json')
  try {
    const localProxyConfig = require('../../local-proxy.conf.json')
    proxyConfig = [].concat(localProxyConfig, proxyConfig)
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      log.warn('[WARN] proxy file "local-proxy.conf.json" not found')
    } else {
      log.error(error)
    }
  }
  const _key = Buffer.from('')
  let ucContextHandler

  return {
    devMiddleware: {
      publicPath,
    },
    static: false,
    // noInfo: true,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': '*',
    // },

    historyApiFallback: false,
    allowedHosts: [baseDomain, ...allowedOrigins],
    // public: domainHeader,
    https: {
      passphrase: 'UesDeveloper123',
      cert: path.resolve(__dirname, 'devServer.crt'),
      key: path.resolve(__dirname, 'devServer.key'),
    },
    http2: true,
    proxy: proxyConfig.map(p => {
      /** @param {import('http').ClientRequest} proxyReq  */
      p.onProxyReq = proxyReq => {
        // remove cookies
        proxyReq.removeHeader('Cookie')
      }
      return p
    }),
    /**
     * @param {{ app: import('express').Application; } & import('https').Server} server
     */
    onBeforeSetupMiddleware: server => {
      const {
        app,
        middleware: {
          context: { logger, log = logger },
        },
      } = server

      app.use(
        cors({
          origin: /[.]cylance[.]com$/,
          allowedHeaders: '*',
          exposeHeaders: '*',
          credentials: true,
          maxAge: 86400,
          preflightContinue: false,
        }),
      )

      app.use((req, res, next) => {
        debugLogger('onBeforeSetupMiddleware.start', req.url)
        res.set('X-Served-By', xPoweredBy.static)

        // validate http hostname
        let hostname = req.headers.host ? req.headers.host.replace(/:[0-9]+$/, '') : req.hostname
        if (!allowedAuthorities.has(hostname)) {
          log.warn('locaHostRedirect', hostname, Array.from(allowedAuthorities.entries()))
          return res.set('X-Served-By', xPoweredBy.express).redirect(`https://${domainHeader}${req.originalUrl}`)
        }

        // root url handler "/"
        let pathname = req.path
        if (pathname === '/') {
          // publicPath of local app as default url
          if (req.query && req.query.redirecturi) {
            log.info('Rewrite', pathname, '->', '/Login', req.url)
            return res.set('X-Served-By', xPoweredBy.express).redirect(req.url.replace(/^\//, '/Login'))
          }
          log.info('Rewrite', pathname, '->', publicPath, req.url)
          return res.set('X-Served-By', xPoweredBy.express).redirect(req.url.replace(/^\//, publicPath))
        }

        next()
      })

      // resources which are disconnected from webpack and have static mount paths
      apiDevServer(app, server)
      i18nDevServer(app, server)

      ucContextHandler = (req, res, next) => {
        debugLogger('onBeforeSetupMiddleware.urlContext', req.url)

        // parse use cases
        req.ctx = req.ctx || {}
        req.ctx.isUcUrl = /^\/(uc\/|pwa\/|sw.js)/.test(req.url)
        req.ctx.isAppUrl = req.ctx.isUcUrl && req.url.startsWith(publicPath)
        req.ctx.isStaticUrl = req.ctx.isUcUrl && !req.ctx.isAppUrl

        if (req.ctx.isUcUrl && /\/$/.test(req.originalUrl)) {
          const location = req.url.slice(0, -1)
          log.debug('[WDS] redirect', req.url, '->', location)
          res.set('X-Served-By', xPoweredBy.express).status(301).redirect(location)
          return
        }

        if (req.ctx.isUcUrl) {
          // cache-control headers
          const pathname = req.path
          if (pathname === hmrSocketPath) {
            // hmr socket noop
          } else if (/\/favicon[.]ico$/i.test(pathname) || /\/pwa\/images\//i.test(pathname)) {
            // cache-control headers for static assets
            res.set('Cache-Control', 'public, max-age=604800')
          } else {
            // cache-control headers for others
            res.set('Cache-Control', 'public, max-age=0')
          }
        }

        res.set('X-Served-By', xPoweredBy.app)
        next()
      }
      app.use(ucContextHandler)

      app.get('/favicon.ico', (req, res, next) => {
        req.path = `/pwa/${req.path}`
        next()
      })

      app.use((req, res, next) => {
        debugLogger('onBeforeSetupMiddleware.complete', req.url)
        next()
      })
    },
    /**
     * @param {{ app: import('express').Application } & import('https').Server} server
     */
    onAfterSetupMiddleware: server => {
      const {
        app,
        middleware: {
          context: { logger, log = logger },
        },
      } = server

      app.use((req, res, next) => {
        debugLogger('onAfterSetupMiddleware.start', req.url)
        res.set('X-Served-By', xPoweredBy.proxy)

        if (!req.ctx) return ucContextHandler(req, res, next)
        next()
      })

      if (!isCypressCI) {
        sessionMgrProxy(app, { ...Config, domain, logger: log })
      }

      const serveStatic = express.static(contentBase, staticOptions)
      app.use((req, res, next) => {
        debugLogger('onAfterSetupMiddleware.serveStatic1', req.url)
        if (req.ctx.isStaticUrl) {
          res.set('X-Served-By', xPoweredBy.static)
          if (req.accepts('html') && !/(\.\S{1,5}|\/)([?].*)?$/.test(req.url)) {
            debugLogger('try auto-index', req.originalUrl)
            req.url += '/index.html'

            if (req.ctx.isAppUrl) return app(req, res)

            return serveStatic(req, res, error => {
              if (error) {
                return next(error)
              }
              req.url = req.url.slice(0, -1)
              debugLogger('fail auto-index', req.originalUrl)
              serveStatic(req, req, error => {
                if (error) return next(error)
                res.set('X-Served-By', xPoweredBy.proxy)
                next()
              })
            })
          }
          return serveStatic(req, res, next)
        }
        next()
      })

      app.use((req, res, next) => {
        if (req.ctx.isUcUrl) {
          debugLogger('uc asset not found (404)', req.url)
          return res.status(404).end()
        }
        next()
      })

      if (!isCypressCI) {
        const venueProxy = require('../proxy/venueProxy')
        venueProxy(app, { ...Config, domain, logger: log })
      }
    },
  }
}
