const path = require('path')
const nxWorkspace = require('../../workspace.json')

const project = 'api'

module.exports = (
  app,
  {
    middleware: {
      context: { logger, log = logger },
    },
  },
) => {
  const root = nxWorkspace.projects[project]
  const { sourceRoot } = typeof root === 'string' ? require(path.join('..', '..', root, 'project.json')) : root

  const serveStatic = require('express').static(sourceRoot, {
    fallthrough: false,
    index: false,
    redirect: false,
  })

  // serve static translation files
  const mountPath = '/uc/api/'
  app.all(`${mountPath}*`, [
    (req, res) => {
      req.url = req.url.slice(mountPath.length)
      serveStatic(req, res, error => {
        if (error) {
          log.error(error.message)
        }
        res.status(404).end()
      })
    },
  ])
}
