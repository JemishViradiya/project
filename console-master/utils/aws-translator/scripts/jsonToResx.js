const path = require('path')
const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

const { js2resx } = require('resx')

const {
  RESX_LOCATION,
  OUTPUT_DIRECTORY,
  LANGUAGES,
  NAMESPACES_LOGIN,
  NAMESPACES_VENUE,
  NAMESPACES_PROVISIONING,
  NAMESPACES_GOOGLE_AUTH,
  NAMESPACES_FIDO_WPF,
  LOGIN_TRANS_LOC,
  VENUE_TRANS_LOC,
  PROVISIONING_TRANS_LOC,
  GOOGLE_AUTH_TRANS_LOC,
  FIDO_WPF_TRANS_LOC,
} = require('./shared')

const run = async (opts = {}) => {
  const { i18nImportDir, namespaces, inputSubDir } = opts

  for (const language of LANGUAGES) {
    try {
      for (const namespace of namespaces) {
        const subDirs = namespace.split('.')
        const jsonObj = await readFile(path.join(i18nImportDir, ...subDirs, `${language}.json`), { encoding: 'utf-8' })
        const translation = JSON.parse(jsonObj).translation
        const xmlData = await js2resx(translation)

        const outputDir = path.join(OUTPUT_DIRECTORY, RESX_LOCATION, inputSubDir)
        await mkdir(outputDir, { recursive: true, force: true })
        await writeFile(path.join(outputDir, language === 'en-US' ? `${namespace}.resx` : `${namespace}.${language}.resx`), xmlData)
      }
    } catch (error) {
      if (error.code === 'ENOENT' && error.path) {
        console.error(`WARNING - path not found: ${error.path}`)
      } else {
        console.error(error.stack || error)
      }
      continue
    }
  }
}

module.exports = run

if (require.main === module) {
  const usageMsg = 'Usage: node scripts/jsonToResx /path/to/json/file/directory venue|login|provisioning|googleAuth|fidoWPF'
  if (!process.argv[3]) {
    console.error(usageMsg)
    process.exit(2)
  }

  let opts
  if (process.argv[3] === VENUE_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], VENUE_TRANS_LOC),
      namespaces: NAMESPACES_VENUE,
      inputSubDir: VENUE_TRANS_LOC,
    }
  } else if (process.argv[3] === LOGIN_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], LOGIN_TRANS_LOC),
      namespaces: NAMESPACES_LOGIN,
      inputSubDir: LOGIN_TRANS_LOC,
    }
  } else if (process.argv[3] === PROVISIONING_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], PROVISIONING_TRANS_LOC),
      namespaces: NAMESPACES_PROVISIONING,
      inputSubDir: PROVISIONING_TRANS_LOC,
    }
  } else if (process.argv[3] === GOOGLE_AUTH_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], GOOGLE_AUTH_TRANS_LOC),
      namespaces: NAMESPACES_GOOGLE_AUTH,
      inputSubDir: GOOGLE_AUTH_TRANS_LOC,
    }
  } else if (process.argv[3] === FIDO_WPF_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], FIDO_WPF_TRANS_LOC),
      namespaces: NAMESPACES_FIDO_WPF,
      inputSubDir: FIDO_WPF_TRANS_LOC,
    }
  } else {
    console.error('Unknown json location.')
    console.error(usageMsg)
    process.exit(2)
  }

  run(opts).catch(error => {
    console.error(error.stack || error)
    process.exit(1)
  })
}
