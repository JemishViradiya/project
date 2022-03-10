const devkit = require('@nrwl/devkit')

Object.defineProperty(exports, '__esModule', { value: true })
// Add React-specific configuration
function getWebpackConfig(config, nxOptions, { isCypressCI = false } = {}) {
  config.module.rules.push(
    {
      test: /\.(png|jpe?g|gif|webp)$/,
      type: 'asset',
    },
    {
      test: /\.svg$/,
      oneOf: [
        // If coming from JS/TS file, then transform into React component using SVGR.
        {
          dependency: { not: ['url'] }, // exclude new URL calls
          use: [
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                svgo: false,
                titleProp: true,
                ref: true,
              },
            },
            require.resolve('./asset-loader'),
          ],
        },
        // export a data URI or emit a separate file
        {
          type: 'asset',
        },
      ],
    },
    {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
      },
    },
  )

  if (isCypressCI) {
    devkit.logger.info('Hot refresh disabled in Cypress CI')
    devkit.logger.info('NX instrumenting code for coverage reporting')
    babelPluginOptions(config, options => {
      options.plugins.push(['istanbul', require('../../.nycrc.json')])
    })
  } else if (config.mode === 'development' && config.devServer && config.devServer.hot) {
    // add `react-refresh/babel` to babel loader plugin
    babelPluginOptions(config, options => {
      options.plugins.push([
        require.resolve('react-refresh/babel'),
        {
          skipEnvCheck: true,
        },
      ])
    })

    // add https://github.com/pmmmwh/react-refresh-webpack-plugin to webpack plugin
    const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
    config.plugins.push(
      new ReactRefreshPlugin({
        esModule: true,
        overlay: {
          entry: false,
          useURLPolyfill: false,
          module: require.resolve('./overlay'),
        },
      }),
    )
  }
  return config
}
module.exports = getWebpackConfig

function babelPluginOptions(config, mutatorFn) {
  const babelLoader = config.module.rules.find(rule => (rule.loader || '').toString().includes('babel-loader'))
  if (babelLoader) {
    babelLoader.options['plugins'] = babelLoader.options['plugins'] || []
    mutatorFn(babelLoader.options)
  }
}
