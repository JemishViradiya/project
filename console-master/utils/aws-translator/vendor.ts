import util from 'util'
import fs from 'fs'
import path from 'path'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { pick, set as lodashSet, omit } from 'lodash'

import type { BackendModule } from 'i18next'

import { i18next } from '../../libs/assets/node'
import { allNamespaces, createLogger, flattenObject, emptyObjectRemover } from './utils'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

const {
  backendConnector: { store, backend },
} = i18next.services as { backendConnector: { store: any; backend: BackendModule } }
const console = createLogger('translator')

const options = {
  mode: 'extract' as 'extract' | 'import',
  dryRun: false as boolean,
  vendorDir: path.join(__dirname, '..', '..', 'libs', 'translations', 'vendor'),
  language: [''],
  namespace: [''],
  keySeparator: '.',
}
const wellKnownOptions = Object.keys(options)

export default vendor

async function vendor() {
  Object.assign(
    options,
    yargs(hideBin(process.argv))
      .option('mode', {
        choices: ['extract', 'import'],
        default: options.mode,
      })
      .option('dry-run', {
        default: options.dryRun,
        boolean: true,
      })
      .option('vendor-dir', {
        alias: ['d', 'dir'],
        default: options.vendorDir,
      })
      .option('language', {
        alias: ['l', 'lng'],
        requiresArg: true,
        type: 'array',
        coerce: (arg: string[]) => {
          let args = arg.reduce((acc, arg) => acc.concat(arg.split(',')), [] as string[])
          if (args.length === 1 && args[0] === 'all' && i18next.options.supportedLngs)
            args = Array.from(new Set(i18next.options.supportedLngs.map(lng => lng.split('-')[0])).values()).filter(
              lng => lng !== 'cimode',
            )
          return args
        },
      })
      .option('namespace', {
        alias: ['n', 'ns'],
        requiresArg: true,
        type: 'array',
        coerce: (arg: string[]) => {
          let args = arg.reduce((acc, arg) => acc.concat(arg.split(',')), [] as string[])
          if (args.length === 1 && args[0] === 'all') args = allNamespaces()
          return args
        },
      })
      .demandOption(['language', 'namespace']).argv,
  )

  console.log('start', pick(options, ...wellKnownOptions))

  if (options.keySeparator !== '.') {
    const keySeparator = options.keySeparator === 'false' ? false : options.keySeparator
    i18next.options.keySeparator = keySeparator
    store.options.keySeparator = keySeparator
  }

  const op = options.mode === 'extract' ? extractResource : importResource

  for (const language of options.language) {
    console.info('%s.language "%s"', options.mode, language)
    for (const namespace of options.namespace) {
      console.info('%s.namespace "%s"', options.mode, namespace)
      try {
        await op(language, namespace, options.vendorDir)
        console.info('%s.namespace "%s" completed', options.mode, namespace)
      } catch (error) {
        console.error(error.stack || error)
      }
    }
    console.info('%s.language "%s" completed', options.mode, language)
  }

  console.log('done')
}

async function extractResource(lng: string, ns: string, dir: string) {
  const { interpolator } = i18next.services
  const { loadPath } = i18next.options.backend as { loadPath: string }
  // @ts-ignore
  const translationsFilename = interpolator.interpolate(loadPath, { lng, ns })
  const pendingFilename = translationsFilename.replace(/\.json$/, '.pending')

  const translations = await readFile(translationsFilename)
    .then(buf => JSON.parse(buf.toString('utf-8')))
    .catch(() => ({}))
  const pending = await readFile(pendingFilename)
    .then(buf => JSON.parse(buf.toString('utf-8')))
    .catch(() => ({}))

  const pendingKeys = Object.keys(flattenObject(pending))
  const extracted = omit(translations, ...pendingKeys)

  const extractedFilename = path.join(dir, ns, `${lng}.json`)

  await mkdir(path.dirname(extractedFilename), { recursive: true })
  await writeFile(extractedFilename, JSON.stringify(extracted, emptyObjectRemover, 2) + '\n', { encoding: 'utf-8' })
}

async function importResource(lng: string, ns: string, dir: string) {
  const { interpolator } = i18next.services
  const { loadPath } = i18next.options.backend as { loadPath: string }

  const importedFilename = path.join(dir, ns, `${lng}.json`)
  const imported = JSON.parse(await readFile(importedFilename, { encoding: 'utf-8' }))

  // @ts-ignore
  const translationsFilename = interpolator.interpolate(loadPath, { lng, ns })
  const pendingFilename = translationsFilename.replace(/\.json$/, '.pending')

  const translations = await readFile(translationsFilename)
    .then(buf => JSON.parse(buf.toString('utf-8')))
    .catch(() => ({}))
  const pending = await readFile(pendingFilename)
    .then(buf => JSON.parse(buf.toString('utf-8')))
    .catch(() => ({}))

  const importedFlat = flattenObject(imported)
  const importedKeys = Object.keys(importedFlat)
  for (const key of importedKeys) {
    lodashSet(translations, key, importedFlat[key])
    lodashSet(pending, key, undefined)
  }

  await writeFile(translationsFilename, JSON.stringify(translations, null, 2) + '\n', { encoding: 'utf-8' })
  await writeFile(pendingFilename, JSON.stringify(pending, emptyObjectRemover, 2) + '\n', { encoding: 'utf-8' })
}
