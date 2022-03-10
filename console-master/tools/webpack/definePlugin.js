const { DefinePlugin } = require('webpack')

// Replace the default nx.dev webpack.DefinePlugin with limited 'process.env' variables
module.exports = (config, deployUrl) => {
  const plugin = new DefinePlugin(getClientEnvironment(config.mode, deployUrl).stringified)

  config.plugins.splice(
    config.plugins.find(p => p.constructor.name === 'DefinePlugin'),
    1,
    plugin,
  )
}

/* filter out known variables injected by the @nrwl/cli */
const NX_CLI_VARS = new Set([
  'NX_TASK_HASH',
  'NX_WORKSPACE_ROOT',
  'NX_TERMINAL_OUTPUT_PATH',
  'NX_FORWARD_OUTPUT',
  'NX_TASK_HASH',
  'NX_CLI_SET',
  'NX_INVOKED_BY_RUNNER',
  'NX_MODE',
  'NX_MODE_BUILD',
  'NX_ARGS',
  'NX_BASE',
  'NX_EXTRA_ARGS',
  'NX_DISTRIBUTED_CACHE',
  'NX_JOBS',
  'NX_PAGE_TITLE',
])

process.env.NX_PAGE_TITLE = process.env.NX_PAGE_TITLE || 'BlackBerry UES'

// This is shamelessly nx.dev and modified for our use
// https://github.com/nrwl/nx/blob/11.1.4/packages/web/src/utils/config.ts#L199
function getClientEnvironment(mode, deployUrl) {
  // Grab NODE_ENV and NX_* environment variables and prepare them to be
  // injected into the application via DefinePlugin in webpack configuration.
  const NX_APP = /^NX_/i

  const raw = Object.keys(process.env)
    .filter(key => NX_APP.test(key) && !NX_CLI_VARS.has(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        // Useful for determining whether we’re running in production mode.
        NODE_ENV: mode,
        NODE_CONFIG_ENV: process.env.NODE_CONFIG_ENV || process.env.NODE_ENV,
        WEBPACK_PUBLIC_PATH: deployUrl,
        NX_MUI_XGRID_KEY: process.env.NX_MUI_XGRID_KEY || '',
        BB_BRANDING: process.env.BB_BRANDING || false,
        NX_PAGE_TITLE: process.env.NX_PAGE_TITLE,
        LOCAL_STORAGE_OVERRIDE: process.env.LOCAL_STORAGE_OVERRIDE || true,
      },
    )

  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {}),
  }

  return { stringified }
}
