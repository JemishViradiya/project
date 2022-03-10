import util from 'util'
import fs from 'fs'
import path from 'path'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { pick, set as lodashSet } from 'lodash'

import type { ResourceLanguage, BackendModule } from 'i18next'

import { TranslateClient, TranslateTextCommand, ImportTerminologyCommand } from '@aws-sdk/client-translate'

import { i18next } from '../../libs/assets/node'
import { allNamespaces, createLogger, flattenObject } from './utils'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const {
  backendConnector: { store, backend },
} = i18next.services as { backendConnector: { store: any; backend: BackendModule } }
const console = createLogger('translator')

const options = {
  mode: 'update' as 'overwrite' | 'update',
  dryRun: false as boolean,
  language: [''],
  namespace: [''],
  keySeparator: '.',
  track: false,
}
const wellKnownOptions = Object.keys(options)

export default translator

async function translator() {
  Object.assign(
    options,
    yargs(hideBin(process.argv))
      .option('mode', {
        choices: ['overwrite', 'update'],
        default: options.mode,
      })
      .option('dry-run', {
        default: options.dryRun,
        boolean: true,
      })
      .option('key-separator', {
        alias: 'k',
        default: '.',
      })
      .option('language', {
        alias: ['l', 'lng'],
        requiresArg: true,
        type: 'array',
        coerce: (arg: string[]) => {
          let args = arg.reduce((acc, arg) => acc.concat(arg.split(',')), [] as string[])
          if (args.length === 1 && args[0].toLowerCase() === 'all' && i18next.options.supportedLngs)
            args = Array.from(new Set(i18next.options.supportedLngs.map(lng => lng.split('-')[0])).values()).filter(
              lng => lng !== 'cimode' && lng !== 'en',
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
          if (args.length === 1 && args[0].toLowerCase() === 'all') args = allNamespaces()
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

  for (const language of options.language) {
    console.info('i18n.language "%s"', language)
    await setLanguage(language)
    for (const namespace of options.namespace) {
      console.info('i18n.namespace "%s"', namespace)
      await translateResource(language, namespace)
      console.info('i18n.namespace "%s" completed', namespace)
    }
    console.info('i18n.language "%s" completed', language)
  }

  console.log('done')
}

type TKeyValue = [string, string]

async function translateResource(lng: string, ns: string) {
  await loadI18nResource(lng, ns).catch(error => {
    if (error?.message) console.warn(error.message)
  })

  const translator = translateKey(lng, ns)
  await translator.next()
  const tracker = options.track ? await trackResource(lng, ns) : undefined

  for await (const item of readResource('en', ns)) {
    // console.debug('read %s: %s', ...item)
    if (options.mode === 'update') {
      const existing = i18next.getResource(lng, ns, item[0])
      if (existing) continue
    }

    const res = await translator.next(item)
    if (!res.value) break

    const [key, value] = res.value
    store.addResource(lng, ns, key, value)
    tracker?.mark(key)
  }
  const bundle = i18next.getResourceBundle(lng, ns)
  // @ts-ignore
  backend.save(lng, ns, bundle)

  await tracker?.persist()
}

const primaryResources: Record<string, ResourceLanguage> = {}
async function* readResource(lng: string, ns: string) {
  const primaryResource = primaryResources[ns] || (primaryResources[ns] = await loadI18nResource(lng, ns))

  const input = flattenObject(primaryResource)
  for (const key in input) {
    yield [key, input[key]] as TKeyValue
  }
}

async function* translateKey(lng: string, ns: string) {
  const client = new TranslateClient({
    region: process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
    logger: createLogger('aws'),
  })

  const TerminologyName = 'ues-console-default'
  if (!options.dryRun) {
    const data = new Uint8Array(await readFile(path.join(__dirname, 'terminology.csv')))
    await client.send(
      new ImportTerminologyCommand({
        Name: TerminologyName,
        MergeStrategy: 'OVERWRITE',
        TerminologyData: {
          File: data,
          Format: 'CSV',
        },
      }),
    )
  }

  let iter: TKeyValue = yield
  while (iter) {
    const [key, value] = iter

    console.info('translate %s: %s', key, value)
    let translatedText: string
    if (!value) {
      translatedText = ''
    } else {
      const terms = collectTerms(value)
      if (options.dryRun) {
        translatedText = i18next.getResource(lng, ns, key) || i18next.getResource('en', ns, key)
        // translatedText = value.replace(/[^{}]/g, v => String.fromCharCode(v.charCodeAt(0) + 9728 - 60))
      } else {
        const result = await client.send(
          new TranslateTextCommand({
            SourceLanguageCode: 'en',
            TargetLanguageCode: lng,
            Text: value,
            TerminologyNames: [TerminologyName],
          }),
        )
        translatedText = result.TranslatedText || value
      }
      translatedText = applyTerms(translatedText || '', terms)
    }
    console.debug('translate %s: %s => %s', key, value, translatedText)

    iter = yield [key, translatedText] as TKeyValue
  }
}

async function trackResource(lng: string, ns: string) {
  const { interpolator } = i18next.services
  const { loadPath } = i18next.options.backend as { loadPath: string }
  // @ts-ignore
  const filename = interpolator.interpolate(loadPath, { lng, ns }).replace(/\.json$/, '.pending')

  const tracked = await readFile(filename)
    .then(buf => JSON.parse(buf.toString('utf-8')))
    .catch(() => ({}))

  return {
    mark: (key: string) => lodashSet(tracked, key, 'aws'),
    persist: async () => {
      await writeFile(filename, JSON.stringify(tracked, null, 2) + '\n', {
        encoding: 'utf-8',
      })
    },
  }
}

function loadI18nResource(lng: string, ns: string): Promise<ResourceLanguage> {
  return new Promise((resolve, reject) => {
    i18next.services.backendConnector.load([lng], [ns], (err, result) => {
      if (err) reject(err)
      else resolve(i18next.getResourceBundle(lng, ns))
    })
  })
}

function setLanguage(language: string) {
  return new Promise(resolve => i18next.changeLanguage(language, resolve))
}

function collectTerms(value: string) {
  const terms: string[] = []
  const pattern = /{{[^}]+}}/g
  let match
  while ((match = pattern.exec(value))) {
    terms.push(match[0])
  }
  return terms
}

function applyTerms(value: string, terms: string[]) {
  if (!value || terms.length === 0) return value
  const result = value.replace(/[{]+[^}]+[}]+/gu, substr => terms.shift() || substr)
  // console.warn('applyTerms', terms, result)

  return result
}
