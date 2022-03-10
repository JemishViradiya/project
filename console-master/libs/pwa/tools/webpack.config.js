const path = require('path')

function getWebpackConfig(cfg, nxOptions, ...args) {
  // const { options, buildOptions = options } = nxOptions

  if (cfg.mode === 'production') {
    cfg.output.path += '/' + path.basename(cfg.output.path)
  }

  let config = cfg

  cfg.target = 'webworker'

  process.env.NODE_ENV = config.mode
  const hasWebpackDevServer = !!config.devServer

  config.resolve.aliasFields = config.resolve.mainFields

  Object.assign(config.resolve.alias, {
    lodash: 'lodash-es',
  })

  // customize the devServer
  if (hasWebpackDevServer) {
    // Not implemented
  }

  Object.assign(config.output, {
    hashSalt: '8Z1y2c0qRN8',
    uniqueName: path.basename(config.output.publicPath),
    chunkLoading: 'import-scripts',
    filename: '../[name].js',
  })

  const { main } = config.entry
  config.entry = { sw: main }

  require('../../../tools/webpack/definePlugin')(config)
  require('../../../tools/webpack/output')(config)

  config.resolve.modules = ['node_modules']
  require('../../../tools/webpack/licenses')(config)

  Object.assign(config.stats, {
    entrypoints: true,
    chunks: true,
    errorDetails: true,
    groupAssetsByPath: false,
    assets: true,
    runtimeModules: true,
    chunkModulesSpace: 20,
  })

  // ensure our modules are always the same
  config.output.chunkLoadingGlobal = 'webpackUesConsole'
  config.output.chunkFilename = config.output.chunkFilename.replace('chunkhash', 'contenthash')

  if (config.optimization) {
    // use defaults for webpack5
    delete config.optimization.moduleIds
    delete config.optimization.chunkIds

    Object.assign(config.optimization, {
      runtimeChunk: false,
      concatenateModules: true,
      splitChunks: false,
    })
  }

  config.plugins = config.plugins.filter(p => p.constructor.name !== 'IndexHtmlWebpackPlugin')

  // console.log(require('util').inspect(config, false, 4))
  return config
}

module.exports = getWebpackConfig
