const path = require('path')
const util = require('util')
const fs = require('fs')
const webpack = require('webpack')

const logger = require('debug')('webpack:split-chunks')

module.exports = splitChunks

const packageRawContent = fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), { encoding: 'utf8' })
const packageJSON = JSON.parse(packageRawContent)

/**
 * Map out known groupings of dendencies
 */
const aliases = {
  '@babel/runtime': [
    'tslib',
    // '@babel/runtime',
    'webpack',
    'webpack-dev-server',
    '@nrwl/web',
    'style-loader',
    'sockjs-client',
    'has-symbols',
    'util.promisify',
    'svgo',
  ],
  'react-dom': [
    'react',
    'react-refresh',
    'scheduler',
    'react-is',
    'core-js-pure',
    'core-js',
    '@pmmmwh/react-refresh-webpack-plugin',
    'shallowequal',
    'clsx',
  ],
  'react-router-dom': ['react-router', 'history'],
  'react-i18next': [
    'i18next',
    'i18next-browser-languagedetector',
    'i18next-chained-backend',
    'i18next-http-backend',
    'i18next-localstorage-backend',
  ],
  redux: ['redux-thunk', 'reselect'],
  // '@material-ui/core': ['@material-ui/styles', '@material-ui/utils', '@material-ui/styles', 'react-transition-group']
}

const skipChunks = new Set(['sw-register', 'runtime'])
const rootModules = new Set([])

const knownMap = new Map()
const nameMap = resolveAliases(aliases)
const supportedLocales = (packageJSON.config || {}).locales || ['en']

function splitChunks(config) {
  // Ignore unsupported locale files of moment
  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /moment[/\\]((dist|src|min)[/\\])?locales?/,
      new RegExp(`(${supportedLocales.join('|')})`),
    ),
  )
  // Ignore unsupported locale files of date-fns
  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /date\-fns[\/\\]/,
      new RegExp(`[/\\\\\](${supportedLocales.join('|')})[/\\\\\]index\.js$`),
    ),
  )

  // use defaults for webpack5
  delete config.optimization.moduleIds
  delete config.optimization.chunkIds

  // ensure our modules are always the same
  config.output.chunkLoadingGlobal = 'webpackUesConsole'

  // always skip the runtime chunk
  const runtimeChunk = config.optimization.runtimeChunk
  const rc = runtimeChunk && typeof runtimeChunk === 'object' ? runtimeChunk.name : runtimeChunk
  if (rc) skipChunks.add(rc)

  config.output.chunkFilename = config.output.chunkFilename.replace('chunkhash', 'contenthash')

  const cdnPublicPath = config.mode !== 'production' ? 'modules/' : '../cdn/modules/'
  Object.assign(config.optimization.splitChunks.cacheGroups, {
    vendor: false,
    modules: {
      priority: 25,
      enforce: true,
      filename: `${cdnPublicPath}${config.output.chunkFilename}`,
      chunks: chunk => chunk.isOnlyInitial() && (!chunk.name || !skipChunks.has(chunk.name)),
      test: /[\\/]node_modules[\\/]/,
      name: (module, chunks) => getDevModuleName(module, chunks) || 'MODULES',
    },
    asyncModules: {
      priority: 20,
      enforce: true,
      filename: `${cdnPublicPath}${config.output.chunkFilename}`,
      chunks: chunk => !chunk.isOnlyInitial(),
      test: /[\\/]node_modules[\\/]/,
      name: (module, chunks) => `${getDevModuleName(module, chunks) || 'MODULES'}-lazy`,
    },
  })

  if (config.mode !== 'production') {
    Object.assign(config.optimization, {
      minimize: false,
      minimizer: [],
      mangleExports: false,
      flagIncludedChunks: true,
      moduleIds: 'named',
      sideEffects: true,
    })
  }

  // console.dir(config.optimization)
}

function getDevModuleName(module, chunks) {
  let nameObj = getOwnModuleName(module)
  if (!nameObj || !nameObj.name) return null
  if (rootModules.has(nameObj.name) || nameObj.name.startsWith('@ues')) {
    return null
  }

  let name = `${nameObj.name}-${nameObj.version}`.replace('/', '-')
  const moduleName = nameMap.get(name)
  if (moduleName) return moduleName

  const issuer = module.issuer // compilation.moduleGraph.getIssuer(module)
  const issuerName = issuer && getDevModuleName(issuer)
  if (issuerName) {
    nameMap.set(name, issuerName)
    logger('   include in', issuerName, name)
    name = issuerName
  } else if (name) {
    logger(
      ' * new       ',
      name,
      // module.resource,
    )
    nameMap.set(name, name)
  } else {
    logger('unable to resolve dependency for', util.inspect(module, { depth: 0 }))
  }

  knownMap.set(nameObj.name, nameObj)
  knownMap.set(nameObj.$path, nameObj)
  return name
}

function getOwnModuleName(module, chunks) {
  let { name, version } = module.resourceResolveData ? module.resourceResolveData.descriptionFileData : {}
  if (!version || !name) {
    if (name) {
      const modname = name
        .split('/')
        .slice(0, name[0] === '@' ? 2 : 1)
        .join('/')
      const known = knownMap.get(modname)
      if (known) return known

      logger('failed to resolve module name via regex', modname)
    }
    if (module.resourceResolveData) {
      const known = knownMap.get(module.resourceResolveData.descriptionFilePath)
      if (known) return known
    }

    const resource = module.resourceResolveData ? module.resourceResolveData.path : module.context
    const match = /^(.*[\\/]node_modules[\\/](?:[@][^\\/]+[\\/])?[^@\\/]+)/.exec(resource)
    if (!match) return null

    const descriptionFilePath = match[1]
    const known = knownMap.get(descriptionFilePath)
    if (known) return known

    logger('fallback dependency resolver', match[1], resource)
    return requirePkg(descriptionFilePath)
  }
  return { name, version }
}

function resolveAliases(mapping) {
  const nameMap = new Map()
  for (const alias in mapping) {
    const aliasPkg = resolvePkg(alias)
    const aliasKey = `${aliasPkg.name}-${aliasPkg.version}`.replace('/', '-')
    nameMap.set(aliasKey, aliasKey)
    knownMap.set(aliasPkg.name, aliasPkg)
    knownMap.set(aliasPkg.$path, aliasPkg)
    for (const pkg of mapping[alias]) {
      const pkgData = resolvePkg(pkg)
      const { name, version } = pkgData
      const key = `${name}-${version}`.replace('/', '-')
      nameMap.set(key, aliasKey)
      knownMap.set(name, pkgData)
      knownMap.set(aliasPkg.$path, pkgData)
    }
  }

  printMap(nameMap)
  const { dependencies } = packageJSON
  for (const depName in dependencies) {
    const pkgData = resolvePkg(depName)
    const { name, version } = pkgData
    const key = `${name}-${version}`.replace('/', '-')
    if (!nameMap.has(key)) {
      nameMap.set(key, key)
      knownMap.set(name, pkgData)
      knownMap.set(pkgData.$path, pkgData)
    }
  }
  return nameMap
}

function resolvePkg(name) {
  try {
    return requirePkg(name)
  } catch (error) {
    /* pass */
  }

  const pkg = name.split('-').slice(0, -1).join('-')
  return requirePkg(pkg)
}

function requirePkg(name) {
  const base = path.join(__dirname, '..', '..', 'node_modules')
  const resolved = path.resolve(base, name, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(resolved, { encoding: 'utf8' }))
  pkg.$path = resolved
  return pkg
}

/**
 * @param {Map} nameMap
 */
function printMap(nameMap) {
  const bundles = {}
  for (const [pkg, bundle] of nameMap.entries()) {
    if (!(bundle in bundles)) {
      bundles[bundle] = []
    }
    bundles[bundle].push(pkg)
  }
  for (const bundleName of Object.keys(bundles).sort()) {
    logger('%s', bundleName)
    for (const pkg of bundles[bundleName]) {
      logger('\t%s', pkg)
    }
  }
}
