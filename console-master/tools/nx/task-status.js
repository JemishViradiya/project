const { createProjectGraphAsync } = require('@nrwl/workspace/src/core/project-graph')
const { createTask } = require('@nrwl/workspace/src/tasks-runner/run-command')
const { Hasher } = require('@nrwl/workspace/src/core/hasher/hasher')

const { remoteCache } = require('./tasks-runner')

const _context = {}
const getContext = async ({ projectGraph } = {}) => {
  if (!_context.projectGraph) {
    const nxJson = require('../../nx.json')
    const workspaceJson = require('../../workspace.json')

    if (!projectGraph) {
      projectGraph = await createProjectGraphAsync()
    }

    const hasher = new Hasher(projectGraph, nxJson, nxJson.tasksRunnerOptions.default.options)
    Object.assign(_context, { projectGraph, hasher, nxJson, workspaceJson, cacheDirectory: 'node_modules/.cache/nx' })
  }
  return _context
}

const noop = () => {
  /* empty */
}
const noopLogger = {
  info: noop,
  log: noop,
  warn: noop,
  error: noop,
  trace: noop,
}

const _lookup = {}
const lookup = async (opts, { projectGraph, hasher, cacheDirectory, skipNxCache = false }) => {
  const { project, target, configuration = 'production' } = opts
  const graphTarget = getGraphTarget(projectGraph, project, target)

  if (!graphTarget) {
    return null
  }

  const { project: _p, target: _t, all: _a, excludeCached: _e, ...overrides } = opts
  const key = `${project}:${target}:${configuration}`
  if (!(key in _lookup)) {
    const task = createTask({
      project: projectGraph.nodes[project],
      target,
      configuration,
      overrides,
      errorIfCannotFindConfiguration: false,
    })

    const taskHash = await hasher.hashTaskWithDepsAndContext(task).catch(error => {
      console.error(error)
      throw error
    })

    task.hash = taskHash.value
    task.dirty = skipNxCache
      ? true
      : !(await remoteCache.retrieve(task, cacheDirectory, {
          ...opts,
          logger: opts.quiet ? noopLogger : opts.logger,
        }))

    _lookup[key] = task
  }
  return _lookup[key]
}

const getTaskStatus = async opts => {
  const context = await getContext(opts)
  return await lookup(opts, context)
}

module.exports = { default: getTaskStatus, getContext }

if (require.main === module) {
  getTaskStatus({ project: 'mtd', target: 'build' })
    .then(task => {
      console.log(task)
      process.exit(task && task.dirty ? 1 : 0)
    })
    .catch(error => {
      console.error(error)
      process.exit(101)
    })
}

function getGraphTarget(projectGraph, project, target) {
  const data = projectGraph.nodes[project].data
  if (data.targets) {
    return data.targets[target]
  }
  return data.targets[target]
}
