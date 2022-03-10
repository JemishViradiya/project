module.exports = config => {
  config.plugins = config.plugins.map(plugin => {
    if (plugin.constructor.name !== 'LicenseWebpackPlugin') return plugin
    return new plugin.constructor({
      ...plugin.pluginOptions,
      excludedPackageTest: name => name.startsWith('@ues') || name.split('/').length > (name[0] === '@' ? 2 : 1),
      handleMissingLicenseType: packageName => {
        console.warn('Missing License for package "%s"', packageName)
        return null
      },
      renderLicenses: modules => {
        const groupBy = require('lodash/groupBy')
        const groups = groupBy(modules, module => module.licenseText || module.licenseId)
        return Object.entries(groups)
          .map(([licenseText, modules]) =>
            [...modules.map(mod => mod.packageJson.name), modules[0].licenseId, modules[0].licenseText || ''].join('\n'),
          )
          .join('\n\n')
      },
    })
  })

  // exclude LicenseWebpackPlugin from terser minification
  const TerserPlugins = config.optimization.minimizer.filter(m => m.constructor.name === 'TerserPlugin')
  if (TerserPlugins) {
    for (const terser of TerserPlugins) {
      terser.options.extractComments = false
      const minimizerOptions = terser.options.minimizer ? terser.options.minimizer.options : terser.options.terserOptions
      if (minimizerOptions) {
        Object.assign(minimizerOptions.output, {
          comments: (astNode, comment) => comment.value.startsWith('! licenses are at '),
        })
      }
    }
  }
}
