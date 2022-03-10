const path = require('path')
const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlinkFile = util.promisify(fs.unlink)

/**
 * Method for merging translations.
 * Copies missing keys from the source file, then overwrites the result with values from target.
 */
async function processDir(name, translationsDir, sourceName, targetName, remove = false) {
  let source = {}
  let dest = {}
  const srcFilename = path.join(translationsDir, name, sourceName)
  const destFilename = path.join(translationsDir, name, targetName)

  process.stdout.write(`${srcFilename} -> ${destFilename}`)
  source = await readFile(srcFilename)
    .then(buf => JSON.parse(buf.toString('utf-8')))
    .catch(() => ({}))

  if (Object.values(source).length > 0) {
    process.stdout.write('\n')
    //console.log(`Start processing ${srcFilename}`)
    dest = await readFile(destFilename)
      .then(buf => JSON.parse(buf.toString('utf-8')))
      .catch(() => ({}))
    if (Object.values(dest).length === 0) return

    const resolved = { ...dest, ...source }
    Object.assign(resolved, dest)

    //console.log(`Writing  ${destFilename}`)
    await writeFile(destFilename, JSON.stringify(resolved, null, 2) + '\n', {
      encoding: 'utf-8',
    }).catch(err => {
      console.error(`Error writing to ${destFilename}`, err)
    })
  } else {
    process.stdout.write(`\r${srcFilename} (blank) -> ${destFilename}\n`)
  }

  if (remove) {
    await unlinkFile(srcFilename).catch(() => ({}))
    //console.log(`Deleted ${srcFilename}`)
  }

  //console.log(`Completed ${srcFilename}`)
}

function devNamespaces(translationsDir) {
  const glob = require('glob')
  const opts = {
    cwd: translationsDir, //path.join(__dirname, '..', '..', 'translations', 'src'),
    matchBase: true,
    // nomount: true,
    // nobrace: true,
    // noext: true,
  }
  const matches = glob.sync('dev.json', opts)
  return matches.map(match => path.dirname(match)).filter(ns => !ns.startsWith('venue'))
}

const run = async (opts = {}) => {
  const { translationsDir } = opts
  const namespaces = devNamespaces(translationsDir)

  console.log('\nBuilding en.json files')
  for (let i = 0; i < namespaces.length; i++) {
    await processDir(namespaces[i], translationsDir, 'dev.json', 'en.json', true)
  }
  console.log('\nBuilding pt-BR.json files')
  for (let i = 0; i < namespaces.length; i++) {
    await processDir(namespaces[i], translationsDir, 'pt.json', 'pt-BR.json')
  }
}

module.exports = run

if (require.main === module) {
  if (!process.argv[2]) {
    console.error('Usage: node buildProd.js /path/to/translation/files')
    process.exit(2)
  }
  run({
    translationsDir: process.argv[2] ? process.argv[2] : './libs/translations/src/',
  }).catch(error => {
    console.error(error.stack || error)
    process.exit(1)
  })
}

// delete dev.json after processing.
