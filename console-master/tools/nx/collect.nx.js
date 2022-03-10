const collectBuilder = (project, nxJson) => ({
  implicitDependencies: Object.entries(nxJson.projects)
    .filter(([, app]) => {
      return app.tags.indexOf('scope:app') !== -1
    })
    .map(([name]) => name),
})
collectBuilder.tag = 'scope:collect'

module.exports = collectBuilder
