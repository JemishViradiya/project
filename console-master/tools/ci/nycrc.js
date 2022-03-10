const { readCachedProjectGraph } = require('@nrwl/workspace/src/core/project-graph')

const base = require('../../.nycrc.json')

module.exports = Object.assign(base, { include: findProjectIncludes() })

function findProjectIncludes() {
  const projectGraph = readCachedProjectGraph('5.0')

  const skipTypes = new Set(['e2e', 'integration'])
  return Object.values(projectGraph.nodes)
    .filter(project => !skipTypes.has(project.data.projectType))
    .map(project => `${project.data.sourceRoot}/**`)
}
