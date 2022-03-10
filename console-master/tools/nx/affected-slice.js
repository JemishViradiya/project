const ChildProcess = require('child_process')
const { promisify } = require('util')

const { default: taskStatus, getContext } = require('./task-status')

const exec = promisify(ChildProcess.exec)

const getAffectedTasks = async (target = 'build', opts = {}) => {
  let nxBase = process.env.NX_BASE || ''
  if (opts.base) {
    nxBase = `--base=${opts.base}`
    if (opts.head) {
      nxBase = `${nxBase} --head=${opts.head}`
    }
  }

  const nxArgs = process.env.NX_ARGS || ''
  let projects
  if (!opts.all) {
    const command = `print-affected ${nxBase} ${nxArgs} --target=${target}`
    console.warn(`> nx ${command}`)
    const { NX_PERF_LOGGING, DEBUG, ...affectedEnv } = process.env
    const affectedCmd = await exec(`node_modules/.bin/nx ${command}`, {
      env: affectedEnv,
    })

    const affectedJson = JSON.parse(affectedCmd.stdout.trim())
    projects = affectedJson.projects
  } else {
    const affectedCmd = await exec(`node_modules/.bin/nx print-affected --all ${nxArgs} --target=${target}`)
    const affectedJson = JSON.parse(affectedCmd.stdout.trim())
    projects = affectedJson.projects.filter(p => !p.startsWith('npm:'))
  }

  const { projectGraph } = await getContext(opts)
  return (await Promise.all(projects.map(project => taskStatus({ project, target, ...opts }).catch(() => null)))).filter(task => {
    if (!task) return false

    if (opts.excludeCached && !task.dirty) return false

    const type = projectGraph.nodes[task.target.project].type
    if (opts.apps && type !== 'app') return false
    if (opts.libs && type !== 'lib') return false
    if (opts.workspace && type !== 'workspace') return false

    if (!task.dirty) return false

    return true
  })
}

if (require.main === module) {
  const ExtraTargets = {
    'disabled-lint': ['tools', '.storybook'],
  }
  const Runners = {
    /* run nx run-many */
    nx: (target, projects) => {
      process.argv.splice(2, 1, 'run-many', `--target=${target}`, `--projects=${projects.join(',')}`)
      console.warn('> nx', Array.from(process.argv).slice(2).join(' '))

      if (opts.dryRun) {
        return
      }
      require('../../node_modules/.bin/nx')
    },
  }

  const args = Array.from(process.argv).slice(2)
  const target = args.shift()

  const nxModeVar = target in ['build', 'storybook', 'review', 'pages'] ? 'NX_MODE_BUILD' : 'NX_MODE'

  const opts = {
    all: process.env[nxModeVar] === 'all',
    parallel: parseInt(process.env.MAX_PARALLEL) || undefined,
    excludeCached: true,
    configuration: 'production',
    quiet: true,
  }
  ;['all', 'dry-run', 'exclude-cached', 'base', 'head', 'libs', 'apps', 'workspace'].forEach(arg => parseOpt(process.argv, arg))

  opts.skipNxCache = !opts.excludeCached
  ;(async () => {
    let tasks = await getAffectedTasks(target, opts)
    if (target in ExtraTargets) {
      tasks = tasks.concat(
        ExtraTargets[target].map(project => ({
          id: `${project}:${target}`,
          target: {
            project,
            target,
          },
        })),
      )
    }

    /* apply gitlab parallel slicing logic */
    const index = parseInt(process.env.CI_NODE_INDEX) || 1
    const total = parseInt(process.env.CI_NODE_TOTAL) || 1
    const each = Math.ceil(tasks.length / total)

    tasks = tasks.slice((index - 1) * each, index * each)

    /* extract project names */
    const projects = tasks.map(t => t.target.project)
    const customRunner = Runners[target]

    if (!projects.length && !customRunner) {
      console.warn(`> nx ${target} [all ${target}s cached]`)
      return
    }

    ;(customRunner || Runners.nx)(target, projects, opts)
  })()

  // eslint-disable-next-line no-inner-declarations
  function parseOpt(args, key) {
    const arg = args.find(arg => new RegExp(`--${key}(=|$)`).test(arg))
    const allIndex = args.indexOf(arg)
    if (arg) {
      args.splice(allIndex, 1)
      const hKey = key.replace(/-(.)/g, (_, ch) => ch.toUpperCase())
      let value = arg.replace(new RegExp(`^--${key}=?`), '') || true
      if (value === 'false') {
        value = false
      } else if (value === 'true') {
        value = true
      } else {
        value = parseInt(value, 10) || value
      }

      opts[hKey] = value
    }
  }
}
