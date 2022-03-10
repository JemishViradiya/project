const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const { projectContext } = require('../tools/webpack/i18nDevServer')

process.env.NX_STORYBOOK = 'true'

// Export a function. Accept the base config as the only param.
module.exports = async (config, { configType }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need

  // const Mode = configType.toLowerCase()
  // process.env.NODE_ENV = Mode

  config.resolve.fallback = config.resolve.fallback || {}
  config.resolve.fallback.assert = require.resolve('assert/')

  config.module.rules.forEach(rule => {
    if (rule.test && /[.|]jsx?/.test(rule.test.toString())) {
      rule.resourceQuery = { not: [/raw/] }
    }
  })
  config.module.rules.splice(
    0,
    0,
    {
      resourceQuery: /raw/,
      type: 'asset/source',
    },
    {
      test: /\.(stories|story-templates)\.[tj]sx?$/,
      use: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: { parser: 'typescript' },
        },
      ],
      enforce: 'pre',
    },
  )

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: '**/*.json',
          ...projectContext('translations'),
        },
        {
          from: 'ui/**/*',
          ...projectContext('api'),
        },
      ],
    }),
  )

  if (process.env.CI === 'true') {
    if (config.devServer) {
      config.devServer.hot = false
      config.devServer.liveReload = false
    }

    const omitPlugins = new Set([
      'ForkTsCheckerWebpackPlugin',
      'HotModuleReplacementPlugin',
      'ReactRefreshPlugin',
      'SourceMapDevToolPlugin',
    ])
    config.plugins = config.plugins.filter(plugin => !omitPlugins.has(plugin.constructor.name))

    config.entry = config.entry.filter(ent => !/webpack-hot-middleware/.test(ent))
  } else if (process.env.DISABLE_TYPECHECK === 'true') {
    const omitPlugins = new Set(['ForkTsCheckerWebpackPlugin'])
    config.plugins = config.plugins.filter(plugin => !omitPlugins.has(plugin.constructor.name))
  }

  // console.dir(config, { depth: 2 })

  // Return the altered config
  return config
}
