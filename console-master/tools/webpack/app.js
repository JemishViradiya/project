const path = require('path')
const devkit = require('@nrwl/devkit')
const getReactWebpackConfig = require('./nrwl-react')

function getWebpackConfig(cfg, nxOptions, ...args) {
  const { options, buildOptions = options } = nxOptions

  if (cfg.mode === 'production') {
    cfg.output.path += '/' + path.basename(cfg.output.path)
  }

  if (process.env.CI === 'true' && cfg.devServer) {
    cfg.devServer.hot = false
  }

  const hasWebpackDevServer = !!cfg.devServer
  const isCypressCI = process.env.CYPRESS_CI_TESTING === 'true'
  if (isCypressCI && hasWebpackDevServer) {
    cfg.watch = false
    cfg.devServer.hot = false
    cfg.devServer.liveReload = false
  }

  let config = getReactWebpackConfig(cfg, nxOptions, { isCypressCI })

  const indexHtmlPlugin = cfg.plugins.find(p => p.constructor.name === 'IndexHtmlWebpackPlugin')
  if (indexHtmlPlugin) {
    // console.log('indexHtmlPlugin: %O', indexHtmlPlugin)
    indexHtmlPlugin.options.baseHref = null
    if (indexHtmlPlugin.options.deployUrl !== buildOptions.deployUrl) {
      throw new Error('Unexpecte: 111111')
    }
    // indexHtmlPlugin.options.deployUrl = buildOptions.deployUrl
  }

  require('./definePlugin')(config, buildOptions.deployUrl)

  process.env.NODE_ENV = config.mode

  const appDir = config.context

  config.resolve.aliasFields = config.resolve.mainFields

  Object.assign(config.resolve.alias, require('./aliases')())

  // customize the devServer
  if (hasWebpackDevServer) {
    const devServer = require('./devServer')

    const logLevel = require('config').webpack.devServer.logLevel.replace(/^debug$/, 'verbose')
    Object.assign(config.devServer, {
      static: false,
      client: {
        logging: logLevel,
        webSocketURL: 'auto://0.0.0.0:0/ws',
        overlay: false,
      },
    })
    const staticOptions = {
      ...config.devServer.static.staticOptions,
      fallthrough: true,
      redirect: false,
      index: false,
    }
    Object.assign(
      config.devServer,
      devServer(
        {
          cdnOptimization: false,
          staticOptions,
          publicPath: '/' + buildOptions.deployUrl.replace(/\/$/, ''),
          contentBase: path.relative(process.cwd(), path.join(__dirname, '../../dist')),
          isCypressCI,
        },
        config.devServer,
      ),
    )

    // DevServer Config
    // console.log(config.devServer)
    config.entry.main = config.entry.main.filter(item => !/\/webpack-dev-server\//.test(item))

    config.devServer.onListening = server => {
      const logListening = hostname => {
        devkit.logger.info(
          `NX Web Development Server is listening at ${server.options.https ? 'https' : 'http'}://${hostname}:${
            server.options.port
          }/${buildOptions.deployUrl.replace(/\/$/, '').replace(/^\//, '')}`,
        )
      }
      logListening('qa2-ues.cylance.com')
      logListening('r00-ues.cylance.com')
    }

    config.infrastructureLogging = Object.assign(config.infrastructureLogging || {}, {
      level: logLevel,
    })

    if (isCypressCI) {
      const omitPlugins = new Set([
        'ForkTsCheckerWebpackPlugin',
        'HotModuleReplacementPlugin',
        'ReactRefreshPlugin',
        'SourceMapDevToolPlugin',
      ])
      config.plugins = config.plugins.filter(plugin => !omitPlugins.has(plugin.constructor.name))
    }

    // mirror condition in './nrwl-react'
    if (config.mode === 'development' && config.devServer.hot) {
      config.entry.main.push('@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry')
    }
  }

  if (!isCypressCI) {
    // add the service-worker
    config.entry['sw-register'] = path.resolve(__dirname, '../../libs/pwa/src/client/index')
  }

  require('./output')(config)

  config.resolve.modules = ['node_modules']
  require('./splitChunks')(config)
  require('./licenses')(config)

  const CdnIdPlugin = require('./plugins/cdnIdPlugin')
  config.plugins.unshift(
    new CdnIdPlugin({
      chunkName: 'modules',
    }),
  )
  Object.assign(config.stats, {
    entrypoints: true,
    chunks: false,
    errorDetails: true,
    groupAssetsByPath: false,
    assets: true,
    runtimeModules: false,
    chunkModulesSpace: 0,
  })

  const miniCssExtractPlugin = config.plugins.find(plugin => plugin.constructor.name === 'MiniCssExtractPlugin')
  if (miniCssExtractPlugin) miniCssExtractPlugin.options.ignoreOrder = true

  // allow per-project overrides
  let hook = path.resolve(__dirname, appDir, 'tools', 'webpack.js')
  try {
    require.resolve(hook)
  } catch (error) {
    hook = undefined
  }
  if (hook) {
    config = require(hook)(config)
  }

  // console.log(require('util').inspect(config, false, 4))
  return config
}

module.exports = getWebpackConfig
