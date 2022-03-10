const path = require('path')
const fs = require('fs')
const https = require('https')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const yargs = require('yargs')
const Config = require('config')

let proxyConfig = require('../../proxy.conf')
const venueProxy = require('./venueProxy')
const nxJson = require('../../nx.json')

try {
  const localProxyConfig = require('../../local-proxy.conf.json')
  proxyConfig = [].concat(proxyConfig, localProxyConfig)
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.warn('[WARN] proxy file "local-proxy.conf.json" not found')
  } else {
    console.error(error)
  }
}

const projectChoices = Object.entries(nxJson.projects)
  .filter(([name, { tags }]) => tags.indexOf('scope:app') !== -1)
  .map(([name]) => name)

const app = express()

const argv = yargs
  // .scriptName("proxy")
  .usage('$0 <cmd> [args]')
  .count('verbose')
  .alias('v', 'verbose')
  .option('p', {
    alias: 'port',
    default: 4200,
    describe: 'port to listen on',
    type: 'number',
  })
  .option('e', {
    alias: 'env',
    default: 'development',
    describe: 'environment to serve',
    type: 'string',
  })
  .option('s', {
    alias: 'static',
    // default: 'dist',
    describe: 'static files to serve',
    type: 'string',
  })
  .option('D', {
    alias: 'default-url',
    default: Config.defaultUrl,
    describe: 'default route for the console "/" url',
  })
  .option('P', {
    alias: 'proxy',
    default: false,
    describe: 'enable cloudfront-esque proxy',
    type: 'boolean',
  })
  .option('c', {
    alias: 'config',
    default: '../../proxy.conf',
    describe: 'proxy config file',
    type: 'string',
  })
  .command(
    '$0 [project]',
    'project',
    yargs =>
      yargs.positional('project', {
        type: 'string',
        describe: 'nx.dev project to serve',
        choices: projectChoices,
        implies: ['env'],
      }),
    argv => {
      if (argv.project) {
        argv.env = 'production'
      }
      if (!argv.static) {
        argv.static = argv.env === 'production' ? 'prod' : 'dist'
      }

      const LEVELS = ['warn', 'info', 'debug']
      const level = (process.env.LOG_LEVEL || '').toLowerCase()
      let idx = argv.verbose ? argv.verbose : LEVELS.indexOf(level)
      argv.logLevel = idx < 0 ? 'warn' : idx > 2 ? 'debug' : LEVELS[idx]
    },
  )
  .help().argv

const logLevel = argv.logLevel

const defaultRoute = (req, res, next) => {
  if (req.url === '/') {
    return res.redirect(argv.defaultUrl)
  }
  next()
}

app.use(defaultRoute)

const noop = () => void 0
const createLogProvider = (...args) => () => ({
  log: logLevel === 'debug' || logLevel === 'info' ? console.log.bind(console, ...args) : noop,
  debug: logLevel === 'debug' ? console.debug.bind(console, ...args) : noop,
  info: logLevel === 'debug' || logLevel === 'info' ? console.info.bind(console, ...args) : noop,
  warn: console.warn.bind(console, ...args),
  error: console.error.bind(console, ...args),
})

const logger = createLogProvider('[proxy]')()

if (argv.static && argv.static !== 'false') {
  logger.info(`Serving static assets from ./${argv.static}`)
  app.use((req, res, next) => {
    req.ctx = req.ctx || {}
    req.ctx.isUcUrl = /^\/(uc\/|pwa\/|sw.js)/.test(req.url)
    if (req.ctx.isUcUrl && /\/$/.test(req.originalUrl)) {
      const location = req.url.slice(0, -1)
      logger.warn('url.redirect', req.url, '->', location)
      return res.redirect(301, location)
    }
    logger.debug(req.method, req.url, req.ctx)
    next()
  })

  const staticRouter = express.Router()
  if (argv.env === 'production') {
    const projects = argv.project ? [argv.project] : projectChoices
    for (const project of projects) {
      // static app build
      staticRouter.use(
        `/uc/${project}`,
        express.static(path.join(process.cwd(), argv.static, project, project), {
          fallthrough: true,
          redirect: false,
        }),
      )

      // static cdn/modules
      staticRouter.use(
        '/uc/cdn/modules',
        express.static(path.join(process.cwd(), argv.static, project, 'cdn', 'modules'), {
          fallthrough: true,
          redirect: false,
        }),
      )

      // static index.html
      staticRouter.use(
        `/uc/${project}`,
        express.static(path.join(process.cwd(), argv.static, project, 'index.html'), {
          fallthrough: true,
          redirect: false,
        }),
      )
    }
    staticRouter.use(
      '/uc/cdn/assets',
      express.static(path.join(process.cwd(), argv.static, 'assets'), {
        fallthrough: true,
        redirect: false,
      }),
    )
    staticRouter.use(
      '/uc/api',
      express.static(path.join(process.cwd(), argv.static, 'api'), {
        fallthrough: true,
        redirect: false,
      }),
    )
    staticRouter.use(
      express.static(path.join(process.cwd(), argv.static, 'pwa'), {
        fallthrough: true,
        redirect: false,
      }),
    )
  } else {
    const serveStatic = express.static(path.join(process.cwd(), argv.static), {
      fallthrough: true,
      redirect: false,
    })
    staticRouter.use(serveStatic)
  }

  app.use(staticRouter)
  app.use(
    (req, res, next) => {
      if (req.ctx.isUcUrl) {
        if (!/(\.\S{1,5}|\/)([?].*)?$/.test(req.url) && req.accepts('html')) {
          logger.log('url.auto-index', req.url)
          req.url += '/'
          return staticRouter(req, res, error => {
            if (error) {
              return next(error)
            }
            req.url = req.url.slice(0, -1)
            logger.debug('fail auto-index', req.originalUrl)
            staticRouter(req, req, error => {
              if (error) return next(error)
              next()
            })
          })
        }
        return staticRouter(req, res, next)
      }
      next()
    },
    (req, res, next) => {
      if (req.ctx.isUcUrl) return res.status(404).end()
      next()
    },
  )
}

if (argv.proxy) {
  const getLogName = ({ target, context = [] }) => (typeof target === 'string' ? 'target' : context[0] || 'anonymous')
  for (const proxy of proxyConfig) {
    const logProvider = createLogProvider(getLogName(proxy).replace(/^https?:\/\//, ''))
    app.use(
      createProxyMiddleware({
        ...proxy,
        logLevel,
        logProvider,
      }),
    )
  }
}

venueProxy(app, {
  ...Config,
  logLevel,
  authorities: Config.authorities,
})

const { domain, allowedOrigins } = Config
const domainHeader = `${domain}:${argv.port}`
const baseDomain = `.${domain.split('.').slice(1).join('.')}`

https
  .createServer(
    {
      allowedHosts: [baseDomain, ...allowedOrigins],
      public: domainHeader,
      https: true,
      http2: true,
      passphrase: 'UesDeveloper123',
      cert: fs.readFileSync(path.resolve(__dirname, '../webpack/devServer.crt')),
      key: fs.readFileSync(path.resolve(__dirname, '../webpack/devServer.key')),
    },
    app,
  )
  .listen(argv.port, '0.0.0.0', () => {
    logger.info(`Serving on https://${domainHeader}/`)
  })
