const path = require('path')

module.exports = config => {
  const repoRoot = path.dirname(path.dirname(__dirname))
  const devToolModulePrefix = 'webpack://source/uc/'
  const devtoolModuleFilenameTemplate = (info, withHash = false) => {
    let { absoluteResourcePath, hash, loaders = '' } = info
    const parts = absoluteResourcePath.split('|')
    if (parts.length > 1) {
      absoluteResourcePath = parts[1]
    }
    const resourcePath = path.relative(repoRoot, absoluteResourcePath)
    if (withHash) loaders = loaders ? `${hash}&${loaders}` : hash

    let result = `${devToolModulePrefix}${resourcePath}`
    if (loaders) result = `${result}?${loaders}`
    return result
  }
  Object.assign(config.output, {
    hashSalt: '8Z1y2c0qRN8',
    uniqueName: path.basename(config.output.publicPath),
    devtoolNamespace: 'repo',
    devtoolFallbackModuleFilenameTemplate: info => devtoolModuleFilenameTemplate(info, true),
    devtoolModuleFilenameTemplate,
  })
}
