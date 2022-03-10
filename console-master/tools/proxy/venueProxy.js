/* eslint-disable sonarjs/no-duplicate-string */
const zlib = require('zlib')
const { pipeline } = require('stream')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { rewriteCookieProperty } = require('http-proxy/lib/http-proxy/common')
const webOutgoing = require('http-proxy/lib/http-proxy/passes/web-outgoing')

const defaultLogLevel = process.env.LOG_LEVEL || 'warn'

const webO = Object.keys(webOutgoing).map(pass => webOutgoing[pass])

const Cache = {
  naviagationHtml: {},
}
const cacheFetch = async (name, url, type = 'text', logger) => {
  if (!Cache.naviagationHtml[name]) {
    const got = require('got')
    logger.info(`FETCH ${url}`)
    Cache.naviagationHtml[name] = await got(url)[type]()
  }
  return Cache.naviagationHtml[name]
}

/**
 * @param {import('express').Request} req
 */
const getHostname = req => {
  return (req.ctx && req.ctx.authority) || req.hostname || req.headers.host.replace(/:[0-9]+$/, '')
}

const onProxyResLib = (proxyRes, req, res, options, server) => {
  if (!res.headersSent) {
    for (var i = 0; i < webO.length; i++) {
      if (webO[i](req, res, proxyRes, options)) {
        break
      }
    }
  }

  if (!res.finished) {
    // Allow us to listen when the proxy has completed
    proxyRes.on('end', function () {
      if (server) server.emit('end', req, res, proxyRes)
    })
  } else {
    if (server) server.emit('end', req, res, proxyRes)
  }
}

const rewrites = new Set([301, 302, 307, 308])
const onProxyResFactory = (
  proxyOptions,
  { venueLogin, venueProtect, manageCookies = true, rewriteHtml = false },
  { logger = console, defaultUrl, fetchContent, login },
) => {
  const rewriteVenueResponseLocation = (proxyRes, req) => {
    let location = proxyRes.headers.location
    if (location.startsWith('https://')) {
      location = `${location.replace(/^https:\/\/[^/]+/, '')}`
      if (location === `/` || location === '' || location.startsWith('/?')) {
        location = `${venueLogin.defaultLocation}${location.slice(1)}`
      }
    } else if (location.startsWith('/?redirecturi')) {
      location = `/Login${location.slice(1)}`
    }
    logger.info('rewriteVenueResponseLocation', location)
    return location
  }
  const rewriteLoginResponseLocation = (proxyRes, req) => {
    let location = proxyRes.headers.location
    if (location.startsWith('https://')) {
      location = location.replace(/^https:\/\/[^/]+/, '')
    }
    logger.info('rewriteLoginResponseLocation', location)
    return location
  }

  async function transform(readable, req) {
    let originalBody = Buffer.alloc(0)

    for await (const chunk of readable) {
      originalBody += chunk
    }

    let scriptContent = ''
    let htmlContent = ''
    if (fetchContent) {
      const navigationHtml = await cacheFetch('navigationHtml', `https://${getHostname(req)}${venueProtect.navigationUrl}`, logger)
      const match = /<body[^>].*<div id="root"><\/div>(.*)<\/body>/ms.exec(navigationHtml)
      scriptContent = match[1].trim()
      htmlContent = `<div id="uesnav" style="background:#061526; height: 100vh; width: 54px; position: absolute; top: 0; left: 0"></div>`
    } else {
      htmlContent = `
      <div id="placeholderNav" style="height: 100vh; width: 54px; position: absolute; top: 0; left: 0; border: none; background: #061526"></div>
      <iframe id="uesnav" style="height: 100vh; width: 320px; position: fixed; top: 0; left: 0; border: none" src="${venueProtect.navigationUrl}"></iframe>
      `
    }

    const value = originalBody
      .toString('utf-8')
      .replace(/<header[ >][\s\S]*<\/header>/gm, match => {
        const m = /<script[ >][\s\S]*<\/script>/gm.exec(match)
        if (!m) {
          return match
        }
        return `${m[0]}${htmlContent}`
      })
      .replace(/<\/head>/, `${scriptContent}</head>`)
    logger.debug(`[HPM] transform ${req.path}`)
    return value
  }

  return onProxyRes

  // const venueProtectDomain = venueProtect.target.replace('-origin', '')
  /**
   * @type {import('http-proxy-middleware').Options['onProxyRes']}
   */
  async function onProxyRes(proxyRes, req, res) {
    const hostname = req.ctx.authority

    logger.debug(login ? 'proxyRes.login' : 'proxyRes.protect', req.ctx.proxyReq.path, proxyRes.headers)

    delete proxyRes.headers['connection']

    const statusCode = proxyRes.statusCode
    if (rewrites.has(statusCode)) {
      const location = proxyRes.headers.location
      const endpoint = login ? 'login' : 'protect'
      const host = 'https://' + req.headers.host
      if (location) {
        if (!login) {
          proxyRes.headers.location = host + rewriteVenueResponseLocation(proxyRes, req)
        } else {
          proxyRes.headers.location = host + rewriteLoginResponseLocation(proxyRes, req)
        }
        // const l = location.replace(venueLogin.target, host).replace(venueProtectDomain, host)
        // proxyRes.headers.location = l
      }
      if (!proxyRes.headers.location) {
        // proxyRes.headers.location = login ? '/' : '/Login'
        proxyRes.headers.location = host + (login ? '/' : '/Login')
      }
      logger.info(
        `[HPM] rewrite (${req.ctx.env}-${endpoint}) ${req.method} ${hostname} ${req.path} [${location} => ${proxyRes.statusCode} ${proxyRes.headers.location}]`,
      )
    }

    if (manageCookies) {
      const cookieKey =
        'set-cookie' in proxyRes.headers ? 'set-cookie' : 'Set-Cookie' in proxyRes.headers ? 'Set-Cookie' : undefined
      if (cookieKey) {
        proxyRes.headers[cookieKey] = rewriteCookieProperty(proxyRes.headers[cookieKey], { '*': '.cylance.com' }, 'domain')
        logger.debug(`COOKIE ${proxyRes.headers[cookieKey]}`)
      }
    }

    if (!rewriteHtml || !/text\/html(;.*)?$/.test(proxyRes.headers['content-type'])) {
      onProxyResLib(proxyRes, req, res, proxyOptions)
      if (!res.finished) {
        proxyRes.pipe(res)
      }
      return
    }

    const contentEncoding = proxyRes.headers['content-encoding']
    delete proxyRes.headers['content-encoding']

    onProxyResLib(proxyRes, req, res, proxyOptions)

    try {
      const isGzip = contentEncoding === 'gzip'
      logger.debug(`[HPM] pipe.html ${req.method} ${req.path} ${proxyRes.statusCode}`)
      const input = !isGzip
        ? proxyRes
        : pipeline(proxyRes, zlib.createGunzip(), function (isssue) {
            // logged elsewhere
          })

      const output = await transform(input, req)
      res.send(output)
    } catch (error) {
      res.status(500).end(`Transform error: ${error.message}`)
      logger.error(error)
    }
  }
}

/**
 * @param {import('express').Application} app
 */
module.exports = (app, config) => {
  const { authorities, venueProxy, logLevel = defaultLogLevel, logger = console, defaultUrl } = config

  const loginProxyPaths = ['/Login', '/EnterpriseLogin', '/login', '/enterpriselogin']
  const autoRewrite = true

  const handlerFactory = venueProxy => {
    const { venueLogin, venueProtect } = venueProxy
    const loginHost = venueLogin.target.replace('-origin', '').replace('https://', '')
    /** @type {import('http-proxy-middleware').Options} */
    const loginProxyOptions = {
      logLevel,
      logProvider: () => logger,
      target: venueLogin.target,
      secure: false,
      changeOrigin: true,
      autoRewrite,
      selfHandleResponse: true,
      onProxyReq: (proxyReq, req, res) => {
        req.ctx.proxyReq = proxyReq
        proxyReq.setHeader('host', loginHost)
        proxyReq.removeHeader('connection')
        // proxyReq.setHeader('connection', 'keep-alive')
        if (req.headers.origin) {
          proxyReq.setHeader('origin', 'https://' + loginHost)
        }
        if ((req.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
          proxyReq.setHeader('accept-encoding', 'gzip')
        }
        logger.debug('proxyReq.login', proxyReq.path, proxyReq.getHeaders())
      },
    }
    loginProxyOptions.onProxyRes = onProxyResFactory(loginProxyOptions, venueProxy, { logger, defaultUrl, login: true })

    const loginProxyMiddleware = createProxyMiddleware(['/venue/session'].concat(loginProxyPaths), loginProxyOptions)
    const unconditionalLoginProxyMiddleware = createProxyMiddleware(loginProxyOptions)

    const protectHost = venueProtect.target.replace('-origin', '').replace('https://', '')
    /** @type {import('http-proxy-middleware').Options} */
    const proxyOptions = {
      logLevel,
      logProvider: () => logger,
      target: venueProtect.target,
      secure: false,
      changeOrigin: true,
      autoRewrite,
      selfHandleResponse: true,
      onProxyReq: (proxyReq, req) => {
        req.ctx.proxyReq = proxyReq
        proxyReq.setHeader('host', protectHost)
        proxyReq.setHeader('connection', 'keep-alive')
        proxyReq.removeHeader('connection')
        if (proxyReq.hasHeader('origin')) {
          proxyReq.setHeader('origin', 'https://' + protectHost)
        }
        const referer = proxyReq.getHeader('referer')
        if (referer) {
          proxyReq.setHeader('referer', referer.replace(req.headers.host, protectHost))
        }
        if ((req.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
          proxyReq.setHeader('accept-encoding', 'gzip')
        }
        logger.debug('proxyReq.protect', proxyReq.path, proxyReq.getHeaders())
      },
    }
    proxyOptions.onProxyRes = onProxyResFactory(proxyOptions, venueProxy, { logger, defaultUrl })

    const protectProxyMiddleware = createProxyMiddleware(proxyOptions)

    return {
      protectProxyMiddleware,
      loginProxyMiddleware,
      unconditionalLoginProxyMiddleware,
    }
  }

  const handlers = Object.keys(venueProxy).reduce((agg, name) => {
    agg[name] = handlerFactory(venueProxy[name])
    return agg
  }, {})

  const getHandlers = req => {
    if (!req.ctx.handler) {
      req.ctx.authority = getHostname(req)
      const env = authorities[req.ctx.authority] || authorities.fallback
      logger.info(
        `Authority: ${req.ctx.authority} -> ${env} (hostname=${req.hostname}, header=${
          req.headers.host || req.headers[':authority']
        })`,
      )
      req.ctx.handler = handlers[env]
      req.ctx.env = env
    }
    return req.ctx.handler
  }

  app.use((req, res, next) => {
    req.ctx = req.ctx || {}
    const { path: pathname, query, url } = req
    if (pathname === '/' && query && query.redirecturi) {
      logger.info('Rewrite', pathname, '->', '/Login', url)
      return res.redirect(url.replace(/^\//, '/Login'))
    }

    next()
  })

  app.use((req, res, next) => {
    const handlers = getHandlers(req)
    return handlers.loginProxyMiddleware(req, res, next)
  })
  app.use((req, res, next) => {
    const handlers = getHandlers(req)
    if (req.headers.referer && req.accepts(['html', '*/*']) !== 'html') {
      const { pathname } = new URL(req.headers.referer)
      if (loginProxyPaths.some(prefix => pathname.startsWith(prefix))) {
        return handlers.unconditionalLoginProxyMiddleware(req, res, next)
      }
    }
    return getHandlers(req).protectProxyMiddleware(req, res, next)
  })
}
