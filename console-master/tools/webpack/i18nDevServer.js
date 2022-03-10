const path = require('path')

const nxWorkspace = require('../../workspace.json')

const project = 'translations'

const projectContext = project => {
  const root = nxWorkspace.projects[project]
  const {
    sourceRoot: context,
    targets: { build },
  } = typeof root === 'string' ? require(path.join('..', '..', root, 'project.json')) : root
  const to = build.options.outputPath.split('/').slice(1).join('/') + '/'
  return { to, context }
}

/**
 * i18next for webpack devServer
 *   Serve static files with express
 *   Merge missing translations into existing translation files
 *
 * @param {import('express').Application} app
 * @param {import('webpack-dev-server')} server
 */
module.exports = (app, server) => {
  const { json: bodyParser } = require('body-parser')
  const { i18next } = require('../../libs/assets/node')

  const {
    middleware: {
      context: { logger, log = logger },
    },
  } = server
  const i18nLoadPath = i18next.options.backend.loadPath.replace(/\/{{.*$/g, '')
  const { to, context } = projectContext(project)
  const mountPath = '/' + path.join(to, path.relative(context, i18nLoadPath))

  const validateRequest = (req, res, next) => {
    const parts = req.params[0].split('/')
    const lng = parts.pop().replace(/.json$/, '')
    const ns = parts.join('/')
    Object.assign(req.params, { lng, ns })
    if (!ns) {
      // do not throw errors into the UI, use ACCEPTED
      log.warn('NO-LNG', req.uri, req.params, req.body)
      return res.status(202).end()
    }
    next()
  }

  // ensure the language + ns resource is loaded
  const loadI18nResource = (req, res, next) => {
    const { lng, ns } = req.params
    i18next.services.backendConnector.load([lng], [ns], err => {
      if (err && err.code === 'ENOENT') return res.status(204).send()
      next(err)
    })
  }

  // save only missing resources
  const saveI18nMissingResource = (req, res) => {
    const { lng, ns } = req.params
    const body = typeof req.body === 'function' ? req.body() : { ...req.body }
    if (!body) {
      return res.status(202).send()
    }
    for (const key in body) {
      const value = i18next.getResource(lng, ns, key)
      if (value !== undefined) {
        delete body[key]
      }
    }

    const missingKeys = Object.keys(body)
    if (missingKeys.length === 0) {
      return res.status(204).end()
    }

    req.body = body
    log.warn(`Adding missing translations in '${ns}' [${lng}]:`, '\n\t' + missingKeys.join('\n\t'))

    for (const m in body) {
      const {
        backendConnector: { store, backend },
      } = i18next.services
      backend.create([lng], ns, m, body[m])
      // write to store to avoid resending
      store.addResource(lng, ns, m, body[m])
    }
  }

  // serve translation files with eTag support
  const serveStatic = require('express').static(i18nLoadPath, {
    fallthrough: false,
    index: false,
    redirect: false,
  })

  setTimeout(() => log.info(`Content from i18n translations is served from ${path.relative(process.cwd(), i18nLoadPath)}`), 100)

  // serve static translation files
  app.all(`${mountPath}*`, [
    validateRequest,
    (req, res) => {
      req.url = req.url.slice(mountPath.length)
      serveStatic(req, res, error => {
        if (error) log.error(error.message)
        res.status(404).end()
      })
    },
  ])

  // missing keys
  app.post('/uc/i18n/add/*', [bodyParser(), validateRequest, loadI18nResource, saveI18nMissingResource])
}

module.exports.projectContext = projectContext
