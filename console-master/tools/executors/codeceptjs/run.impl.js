Object.defineProperty(exports, '__esModule', { value: true })

const path = require('path')
const process = require('process')
const child_process = require('child_process')
const chalk = require('chalk')

const RunCommands = new Set(['run', 'run-multiple', 'run-workers'])
exports.default = async function (options, context, ..._args) {
  const { projectName, workspace } = context
  const projectRoot = workspace.projects[projectName].root
  const group = `UES-Console/${projectName}`

  if (options.ci) process.env.CI = true
  if (process.env.CI === 'true' && process.env.CODECEPTJS_CI_TESTING !== 'true') {
    console.log('CI only validates codecept.js projects')
    const success = await createProcess(`tsc -p ${path.join(projectRoot, 'tsconfig.integration.json')}`)
    return { success }
  }

  const { command, watch, codeceptjsConfig = path.join('.', projectRoot, 'codecept.conf.js') } = options
  const isCodeceptUI = watch && command === 'run'

  const args = ['--config', codeceptjsConfig]
  if (options.debug) {
    process.env.CODECEPT_DEBUG = 'true'
    args.push('--debug')
  }
  if (options.verbose) {
    process.env.CODECEPT_VERBOSE = 'true'
    args.push('--verbose')
  }
  if (options.steps) args.push('--steps')

  if (options.browser) process.env.CODECEPT_BROWSER = options.browser
  process.env.NODE_CONFIG_DIR = path.join(process.cwd(), 'config', 'codeceptjs')

  if (options.executor) process.env.CODECEPT_EXECUTOR = options.executor

  process.env.SHOW_BROWSER = options.headless ? 'false' : 'true'
  process.env.SLOW_BROWSER = process.env.SHOW_BROWSER
  process.env.NODE_CONFIG_ENV = options.env || process.env.NODE_CONFIG_ENV || 'qa2'
  process.env.CODECEPTJS_REPORTER_TAGS = JSON.stringify({
    jobName: `codeceptjs_${group.replace(/\//g, '_')}`,
    project: group.replace(/\//g, ':'),
    branch: getBranchTag(),
    runner: 'codeceptjs',
    instance: process.env.CI_JOB_ID || process.env.USER || 'local',
  })

  // const argsNext = process.argv.indexOf('--')
  const argsNext = process.argv.findIndex(item => item.startsWith('--'))
  if (argsNext !== -1)
    args.push(
      ...process.argv
        .slice(argsNext + 1)
        .filter(
          arg =>
            !/--(codeceptjsConfig|steps|headless|debug|verbose|executor|profile|browser|env|command|fullStack)(=.*)?$/.test(arg),
        ),
    )

  const tsConfig = options.tsConfig || path.join(projectRoot, 'tsconfig.integration.json')
  process.env.TS_NODE_PROJECT = require('path').resolve(__dirname, '../../..', tsConfig)
  const execute = [isCodeceptUI ? 'codecept-ui' : `codeceptjs ${command}`, ...args].join(' ')

  console.warn(chalk.bold(`> ${execute}`))

  const success = await createProcess(execute, RunCommands.has(command))
  return { success }
}

// copied from node_modules/@nrwl/workspace/src/executors/run-commands/run-commands.impl.js
function createProcess(command, fatalErrors = true, readyWhen = null) {
  return new Promise(res => {
    const childProcess = child_process.exec(command, {
      maxBuffer: exports.LARGE_BUFFER,
      env: process.env, // processEnv(color),
      cwd: process.cwd(),
    })
    /**
     * Ensure the child process is killed when the parent exits
     */
    const processExitListener = () => childProcess.kill()
    process.on('exit', processExitListener)
    process.on('SIGTERM', processExitListener)
    childProcess.stdout.on('data', data => {
      process.stdout.write(data)
      if (readyWhen && data.toString().indexOf(readyWhen) > -1) {
        res(true)
      }
    })
    childProcess.stderr.on('data', err => {
      process.stderr.write(err)
      if (readyWhen && err.toString().indexOf(readyWhen) > -1) {
        res(true)
      }
    })
    childProcess.on('exit', code => {
      if (!readyWhen) {
        res(!fatalErrors || code === 0)
      }
    })
  })
}

function getBranchTag() {
  const branch = process.env.CI_COMMIT_BRANCH
  const mrEvent = process.env.CI_MERGE_REQUEST_EVENT_TYPE

  if (branch === 'master') return 'master'
  if (/^epic\//.test(branch)) return 'epic'
  if (mrEvent === 'merge_train') return 'merge-train'
  return 'other'
}
