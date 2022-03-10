const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getAppWebpackConfig = require('./app')

module.exports = (cfg, nxOptions, args) => {
  nxOptions.configuration = nxOptions.configuration || cfg.mode
  const { buildOptions, options = buildOptions } = nxOptions
  const app = path.basename(options.deployUrl)

  const config = getAppWebpackConfig(cfg, nxOptions, args)

  delete config.entry['sw-register']
  config.plugins.push(
    new HtmlWebpackPlugin({
      publicPath: '',
      filename: 'index-partial.html',
      templateContent: `<div id="root-${app}"><span class="loading">Loading...</span></div><link rel="stylesheet" disabled id="base-${app}" href="">`,
      inject: 'body',
      chunksSortMode: function (chunk1, chunk2) {
        const order = ['polyfills', 'runtime', 'main']
        const order1 = order.indexOf(chunk1)
        const order2 = order.indexOf(chunk2)
        return order1 - order2
      },
    }),
  )

  return config || {}
}
