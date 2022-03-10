/* eslint-disable no-template-curly-in-string */
const { default: defaultTasksRunner } = require('@nrwl/workspace/tasks-runners/default')
const fetch = require('node-fetch')
const { spawn } = require('child_process')
const debug = require('debug')

/* Options */
const compression = 'xz'
const extName = `tar.${compression}`
const defaultBaseUrl = `http://ues-pipeline-su.devlab2k.testnet.rim.net/nx-distributed-cache/`
const BaseUrl = (process.env.NX_DISTRIBUTED_CACHE || defaultBaseUrl).replace(/\/?$/, '')
/* End Options */

const isCI = ['true', '1'].indexOf(process.env.CI) !== -1 || process.argv.indexOf('--ci') !== -1
const isDebug = debug.enabled('nx:distributed-cache')

const getUrl = taskHash => `${BaseUrl}/${remoteCache.prefix}/${taskHash}.${extName}`

const defaultOptions = {}

const remoteCache = {
  prefix: 'nx13',
  headers: {},
  retrieve: async function retrieve(task, cachePath, { logger = console } = defaultOptions) {
    const { id = 'unknown', hash: taskHash } = task
    try {
      /* fetch task archive */
      const res = await fetch(getUrl(taskHash), { headers: { ...remoteCache.headers } })
      if (res.status === 404 || res.headers['content-length'] === '0') {
        throw Object.assign(new Error('cache-miss'), { status: res.status, code: 'ECACHEMISS' })
      } else if (res.status !== 200) {
        throw Object.assign(new Error(res.statusText), {
          status: res.status,
          code: res.status >= 500 && res.status < 600 ? 'ECACHEDOWN' : 'EFAIL',
        })
      }

      /* extract task archive */
      const extract = spawn('tar', [`-${compressionFlag(compression)}${verbosityFlag()}oxC`, cachePath], {
        shell: false,
        stdio: ['pipe', 'ignore', 'inherit'],
      })
      const stream = res.body.pipe(extract.stdin)
      stream.on('error', logger.error.bind(console, '> nx task ${id}'))

      await spawnResult(extract)
      logger.warn(`> nx task ${id} ${taskHash.slice(0, 12)} [cache-hit from distributed cache]`)
      return true
    } catch (error) {
      switch (error.code) {
        case 'ECACHEMISS':
        case 'EPIPE':
          logger.warn(`> nx task ${id} ${taskHash.slice(0, 12)} [cache-miss from distributed cache]`)
          return false
        case 'ECACHEDOWN':
        case 'ENOTFOUND':
          logger.warn(`> nx task ${id} ${taskHash.slice(0, 12)} [distributed cache unavailable]`)
          return false
      }
      logger.error('> nx task ${id}', error)
      throw error
    }
  },
  store: async (task, cachePath, { logger = console } = defaultOptions) => {
    /* compress task archive */
    const { id = 'unknown', hash: taskHash } = task
    const compress = spawn(
      'tar',
      [`-${compressionFlag(compression)}${verbosityFlag()}cC`, cachePath, `${taskHash}.commit`, taskHash],
      {
        shell: false,
        stdio: ['ignore', 'pipe', 'inherit'],
        env: {
          GZIP: '-9',
        },
      },
    )
    const spawned = spawnResult(compress)

    try {
      /* upload task archive */
      const [res] = await Promise.all([
        fetch(getUrl(taskHash), {
          method: 'PUT',
          body: compress.stdout,
          headers: {
            ...remoteCache.headers,
            'content-type': 'application/zip',
          },
        }),
        spawned,
      ])

      if (res.status < 200 || res.status >= 300) {
        if (res.status >= 500 && res.status < 600) {
          throw Object.assign(new Error('Cache Miss'), { code: 'ECACHEDOWN' })
        }
        throw res
      }

      logger.log(`> nx task ${id} ${taskHash.slice(0, 12)} [saved to distributed cache]`)
    } catch (error) {
      switch (error.code) {
        case 'ECACHEDOWN':
        case 'ENOTFOUND':
          logger.warn(`> nx task ${id} ${taskHash.slice(0, 12)} [distributed cache unreachable]`)
          return
      }
      logger.error('> nx task ${id}', error)
    }
  },
}

const customTasksRunner = function CustomTaskRunner(tasks, options, context) {
  if (BaseUrl) {
    if (isCI) {
      /* CI uses a protected webdav storage prefix */
      remoteCache.prefix = '/ci' + remoteCache.prefix
      const token = Buffer.from(`gitlab:${process.env.RSYNC_PASSWORD}`).toString('base64')
      remoteCache.headers = { authorization: `Basic ${token}` }
    }
    options.remoteCache = remoteCache
  }
  return defaultTasksRunner.call(this, tasks, options, context)
}
__extends(customTasksRunner, defaultTasksRunner)

module.exports = { remoteCache, default: customTasksRunner }

function spawnResult(spawned) {
  return new Promise((resolve, reject) => {
    spawned.on('close', code => {
      if (code !== 0) {
        reject(Object.assign(new Error(code), { code }))
      } else {
        resolve()
      }
    })
  })
}

function __extends(cls, base) {
  function fn() {
    this.constructor = cls // this can be omitted
    this.constructor.name = cls.name
  }
  fn.prototype = base.prototype
  cls.prototype = new fn()
}

function compressionFlag(a) {
  return (
    {
      compress: 'Z',
      gzip: 'z',
      gz: 'z',
      xz: 'J',
      bzip2: 'j',
      lzma: 'a',
    }[a] || a
  )
}

function verbosityFlag() {
  return isDebug ? 'v' : ''
}
