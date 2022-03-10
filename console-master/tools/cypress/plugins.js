const path = require('path')
const fs = require('fs')
const debug = require('debug')('cypress:config')

const hasFile = (filePath, ms) => {
  const delay = 10
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(new Error(`Could not find file ${filePath}`))
    }
    const found = fs.existsSync(filePath)
    if (found) {
      return resolve(true)
    }
    setTimeout(() => {
      hasFile(filePath, ms - delay).then(resolve, reject)
    }, 10)
  })
}

// this function has been copied from https://github.com/cypress-io/cypress-example-recipes
const deleteFolder = folderPath => {
  return new Promise((resolve, reject) => {
    fs.rmdir(folderPath, { maxRetries: 10, recursive: true }, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve(null)
    })
  })
}

module.exports = (on, config) => {
  const isInCI = process.env.CI === 'true' || process.env.CYPRESS_CI_TESTING === 'true'
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const nxRoot = path.resolve(__dirname, '../..')
  const projectDir = path.relative(nxRoot, config.projectRoot)
  const outputDir = path.join(nxRoot, 'dist', 'cypress', projectDir)
  const resultsDir = path.join(nxRoot, 'cypress-results', projectDir)

  Object.assign(config, {
    nodeVersion: 'system',
  })

  // const { CI_PIPELINE_ID } = process.env
  if (isInCI) {
    config.nyc = {
      ...require('../../.nycrc.json'),
      cwd: nxRoot,
      'report-dir': resultsDir,
      reporter: ['json'],
      sourceMap: false,
      instrument: false,
      all: true,
      // exclude: ['**/*-e2e/**', 'tools/**', '**/*.spec.ts', '**/*.spec.js'],
    }
    require('./plugin-coverage')(on, config)

    Object.assign(config, {
      downloadsFolder: path.join(outputDir, 'downloads'),
      // these are applied by @nrwl/cypress
      // screenshotsFolder: path.join(outputDir, 'screenshots'),
      // videosFolder: path.join(outputDir, 'videos'),
    })
  }

  debug('CypressConfig: %o', config)

  on('task', {
    seeDownloadedFile(filePath, ms = 4000) {
      return hasFile(filePath, ms)
    },
  })

  on('task', {
    deleteFolder(folderPath) {
      return deleteFolder(folderPath)
    },
  })

  return config
}
