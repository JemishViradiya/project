/* eslint-disable @typescript-eslint/no-var-requires */
// const lessModulesFactory = require('../../../tools/webpack/lessModules')
const { RawSource } = require('webpack-sources')

// const lessModules = lessModulesFactory({
//   extraCssLoaderOptions: {
//     localsConvention: 'dashesOnly',
//   },
// })

function getBisWebpackConfig(config) {
  // lessModules(config)

  config.entry.load = 'apps/bis/src/load.js'

  if (config.devServer) {
    Object.assign(config.devServer, {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      after: () => {},
    })

    // Asset will be present only in "development" mode due to the way how build with "optimization=true" works.
    // See https://github.com/nrwl/nx/blob/11.6.x/packages/web/src/builders/build/build.impl.ts#L189
    // and https://github.com/nrwl/nx/issues/3339 which should be fixed eventually.
    //
    // For "production" see `apps/bis/tools/scripts/change-title.sh` file.
    config.plugins.push({
      apply: compiler => {
        compiler.hooks.emit.tap('ChangeTitlePlugin', compilation => {
          const asset = compilation.getAsset('index.html')
          compilation.updateAsset(
            asset.name,
            new RawSource(asset.source.source().replace(/<title>(.*?)<\/title>/i, '<title>BlackBerry Persona Analytics</title>')),
          )
        })
      },
    })
  }

  return config
}

module.exports = getBisWebpackConfig
