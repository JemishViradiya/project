const path = require('path')
// const VirtualModulesPlugin = require('webpack-virtual-modules')

const getAppWebpackConfig = require('./app')

function getWebpackConfig(cfg, nxOptions, ...args) {
  const { options, buildOptions = options } = nxOptions
  let config = getAppWebpackConfig(cfg, nxOptions, ...args)

  Object.assign(config.resolve.alias, {
    '@ues-virtual/partial': path.resolve(`${buildOptions.sourceRoot}/index.ts`),
  })

  return config
}

module.exports = getWebpackConfig
