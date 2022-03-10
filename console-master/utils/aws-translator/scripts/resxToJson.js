const path = require('path')
const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

const { resx2js } = require('resx')

const {
  JSON_LOCATION,
  OUTPUT_DIRECTORY,
  LANGUAGES,
  CYLANCESERVER_I18N_LOCATION_LOGIN,
  CYLANCESERVER_I18N_LOCATION_VENUE,
  PROVISIONING_I18N_LOCATION,
  GOOGLE_AUTH_I18N_LOCATION,
  FIDO_WPF_AUTH_I18N_LOCATION,
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
  const { i18nImportDir, namespaces, outputSubDir } = opts

  for (const language of LANGUAGES) {
    try {
      for (const namespace of namespaces) {
        const xmlData = await readFile(
          path.join(i18nImportDir, language === 'en-US' ? `${namespace}.resx` : `${namespace}.${language}.resx`),
          { encoding: 'utf-8' },
        )
        const jsonObj = await resx2js(xmlData)

        const outputDir = path.join(OUTPUT_DIRECTORY, JSON_LOCATION, outputSubDir, ...namespace.split('.'))
        await mkdir(outputDir, { recursive: true, force: true })
        await writeFile(path.join(outputDir, `${language}.json`), JSON.stringify({ translation: jsonObj }, null, 2))
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
  const usageMsg = 'Usage: node scripts/resxToJson /path/to/repo venue|login|provisioning|googleAuth|fidoWPF'
  if (!process.argv[3]) {
    console.error(usageMsg)
    process.exit(2)
  }

  let opts
  if (process.argv[3] === VENUE_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], CYLANCESERVER_I18N_LOCATION_VENUE),
      namespaces: NAMESPACES_VENUE,
      outputSubDir: VENUE_TRANS_LOC,
    }
  } else if (process.argv[3] === LOGIN_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], CYLANCESERVER_I18N_LOCATION_LOGIN),
      namespaces: NAMESPACES_LOGIN,
      outputSubDir: LOGIN_TRANS_LOC,
    }
  } else if (process.argv[3] === PROVISIONING_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], PROVISIONING_I18N_LOCATION),
      namespaces: NAMESPACES_PROVISIONING,
      outputSubDir: PROVISIONING_TRANS_LOC,
    }
  } else if (process.argv[3] === GOOGLE_AUTH_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], GOOGLE_AUTH_I18N_LOCATION),
      namespaces: NAMESPACES_GOOGLE_AUTH,
      outputSubDir: GOOGLE_AUTH_TRANS_LOC,
    }
  } else if (process.argv[3] === FIDO_WPF_TRANS_LOC) {
    opts = {
      i18nImportDir: path.join(process.argv[2], FIDO_WPF_AUTH_I18N_LOCATION),
      namespaces: NAMESPACES_FIDO_WPF,
      outputSubDir: FIDO_WPF_TRANS_LOC,
    }
  } else {
    console.error('Unknown resx location.')
    console.error(usageMsg)
    process.exit(2)
  }

  run(opts).catch(error => {
    console.error(error.stack || error)
    process.exit(1)
  })
}
