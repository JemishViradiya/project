/* eslint-disable no-restricted-globals */
// @ts-check
/* modified from https://github.com/cypress-io/code-coverage */

const istanbul = require('istanbul-lib-coverage')
const { join, resolve } = require('path')
const { promisify } = require('util')
const fs = require('fs')
const omitBy = require('lodash/omitBy')
const debug = require('debug')('code-coverage')

const { exists, mkdir, readFile, writeFile } = {
  exists: promisify(fs.exists),
  mkdir: promisify(fs.mkdir),
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
}
const {
  showNycInfo,
  resolveRelativePaths,
  checkAllPathsNotFound,
  tryFindingLocalFiles,
  includeAllFiles,
} = require('./plugin-coverage/task-utils')
const { removePlaceholders } = require('./plugin-coverage/common-utils')

// these are standard folder and file names used by NYC tools
const processWorkingDirectory = process.cwd()

/**
 * Registers code coverage collection and reporting tasks.
 * Sets an environment variable to tell the browser code that it can
 * send the coverage.
 * @example
  ```
    // your plugins file
    module.exports = (on, config) => {
      require('cypress/code-coverage/task')(on, config)
      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    }
  ```
*/
function registerCodeCoverageTasks(on, config) {
  const nycReportOptions = (function getNycOption() {
    // https://github.com/istanbuljs/nyc#common-configuration-options
    const nycReportOptions = config.nyc

    if (nycReportOptions.exclude && !Array.isArray(nycReportOptions.exclude)) {
      console.error('NYC options: %o', nycReportOptions)
      throw new Error('Expected "exclude" to by an array')
    }

    if (nycReportOptions['temp-dir']) {
      nycReportOptions['temp-dir'] = resolve(nycReportOptions['temp-dir'])
    } else {
      nycReportOptions['temp-dir'] = join(processWorkingDirectory, '.nyc_output')
    }

    nycReportOptions.tempDir = nycReportOptions['temp-dir']

    if (nycReportOptions['report-dir']) {
      nycReportOptions['report-dir'] = resolve(nycReportOptions['report-dir'])
    }
    // seems nyc API really is using camel cased version
    nycReportOptions.reportDir = nycReportOptions['report-dir']

    return nycReportOptions
  })()

  const nycFilename = join(nycReportOptions['temp-dir'], 'out.json')

  async function saveCoverage(coverage) {
    if (!(await exists(nycReportOptions.tempDir))) {
      await mkdir(nycReportOptions.tempDir, { recursive: true })
      debug('created folder %s for output coverage', nycReportOptions.tempDir)
    }

    await writeFile(nycFilename, JSON.stringify(coverage, null, 2))
  }

  async function maybePrintFinalCoverageFiles(folder) {
    const jsonReportFilename = join(folder, 'coverage-final.json')
    if (!(await exists(jsonReportFilename))) {
      debug('maybePrintFinalCoverageFiles:warn Did not find final coverage file %s', jsonReportFilename)
      return
    }

    debug('Final coverage in %s', jsonReportFilename)
    if (!nycReportOptions.showFinalCoverage) return

    const finalCoverage = JSON.parse(await readFile(jsonReportFilename, 'utf8'))
    const finalCoverageKeys = Object.keys(finalCoverage)
    debug('maybePrintFinalCoverageFiles:summary There are %d key(s) in %s', finalCoverageKeys.length, jsonReportFilename)

    finalCoverageKeys.forEach(key => {
      const s = finalCoverage[key].s || {}
      const statements = Object.keys(s)
      const totalStatements = statements.length
      let coveredStatements = 0
      statements.forEach(statementKey => {
        if (s[statementKey]) {
          coveredStatements += 1
        }
      })

      const hasStatements = totalStatements > 0
      const allCovered = coveredStatements === totalStatements
      const coverageStatus = hasStatements ? (allCovered ? '✅' : '⚠️') : '❓'

      debug(
        'maybePrintFinalCoverageFiles:summary %s %s statements covered %d/%d',
        coverageStatus,
        key,
        coveredStatements,
        totalStatements,
      )
    })
  }

  const tasks = {
    /**
     * Clears accumulated code coverage information.
     *
     * Interactive mode with "cypress open"
     *    - running a single spec or "Run all specs" needs to reset coverage
     * Headless mode with "cypress run"
     *    - runs EACH spec separately, so we cannot reset the coverage
     *      or we will lose the coverage from previous specs.
     */
    async resetCoverage({ isInteractive }) {
      if (isInteractive) {
        debug('resetCoverage: reset code coverage in interactive mode')
        const coverageMap = istanbul.createCoverageMap({})
        await saveCoverage(coverageMap)
      }
      /*
        Else:
          in headless mode, assume the coverage file was deleted
          before the `cypress run` command was called
          example: rm -rf .nyc_output || true
      */

      return null
    },

    /**
     * Combines coverage information from single test
     * with previously collected coverage.
     *
     * @param {string} sentCoverage Stringified coverage object sent by the test runner
     * @returns {Promise<null>} Nothing is returned from this task
     */
    async combineCoverage(sentCoverage = '[]') {
      debug('combineCoverage:call([%s])', sentCoverage.length)
      try {
        const coverages = JSON.parse(sentCoverage)
        debug('combineCoverage:parse sent coverage([%s])', coverages.length)

        const previousCoverage = (await exists(nycFilename)) ? JSON.parse(await readFile(nycFilename, 'utf8')) : {}
        const coverageMap = istanbul.createCoverageMap(previousCoverage)

        for (const { coverage, pathname } of coverages) {
          // debug('%O', coverages)

          const withoutSpecs = filterSpecsFromCoverage(coverage, config)
          const additionalCoverage = filterSupportFilesFromCoverage(withoutSpecs, config)
          // const additionalCoverage = coverage

          fixSourcePaths(additionalCoverage)

          // previous code coverage object might have placeholder entries
          // for files that we have not seen yet,
          // but the user expects to include in the coverage report
          // the merge function messes up, so we should remove any placeholder entries
          // and re-insert them again when creating the report
          removePlaceholders(previousCoverage)

          coverageMap.merge(additionalCoverage)
        }

        await saveCoverage(coverageMap)
        debug('combineCoverage:write coverage file %s', nycFilename)
      } catch (error) {
        debug('combineCoverage:ERROR %O', error)
      }

      return null
    },

    /**
     * Saves coverage information as a JSON file and calls
     * NPM script to generate HTML report
     */
    async coverageReport() {
      debug('.coverageReport()')
      // return null
      try {
        if (!(await exists(nycFilename))) {
          console.warn('coverageReport:warn Cannot find coverage file %s', nycFilename)
          console.warn('coverageReport:warn Skipping coverage report')
          return false
        }

        showNycInfo(nycFilename)

        const allSourceFilesMissing = checkAllPathsNotFound(nycFilename)
        if (allSourceFilesMissing) {
          tryFindingLocalFiles(nycFilename)
        }

        resolveRelativePaths(nycFilename)

        if (nycReportOptions.customNycReportScript) {
          debug('coverageReport:custom saving coverage report using script "%s"', nycReportOptions.customNycReportScript)
          const reporter = require(nycReportOptions.customNycReportScript)
          reporter(nycFilename, nycReportOptions)
        }

        if (nycReportOptions.all) {
          debug('coverageReport:all nyc needs to report on all included files')
          includeAllFiles(nycFilename, nycReportOptions)
        }

        debug('coverageReport:nyc calling NYC reporter with options %o', nycReportOptions)
        debug('coverageReport:nyc current working directory is %s', process.cwd())
        const NYC = require('nyc')
        const nyc = new NYC(nycReportOptions)

        const returnReportFolder = async () => {
          const reportFolder = nycReportOptions['report-dir']
          debug('coverageReport:report after reporting, returning the report folder name %s', reportFolder)

          await maybePrintFinalCoverageFiles(reportFolder)

          return reportFolder
        }
        return nyc.report().then(returnReportFolder)
      } catch (error) {
        debug('coverageReport:ERROR fatal error %s', error.message)
        console.error(error)
      }
    },
  }

  on('task', tasks)

  on('before:spec', (test, runnable) => {
    debug('Test:Before:Run')
  })
  on('after:spec', (test, runnable) => {
    debug('Test:After:Run')
    return tasks.coverageReport()
  })

  // set a variable to let the hooks running in the browser
  // know that they can send coverage commands
  config.env.codeCoverageTasksRegistered = true

  config.taskTimeout = 30000

  return config
}

module.exports = registerCodeCoverageTasks

/**
 * Replace source-map's path by the corresponding absolute file path
 * (coverage report wouldn't work with source-map path being relative
 * or containing Webpack loaders and query parameters)
 */
function fixSourcePaths(coverage) {
  Object.values(coverage).forEach(file => {
    const { path: absolutePath, inputSourceMap } = file
    const fileName = /([^/\\]+)$/.exec(absolutePath)[1]
    if (!inputSourceMap || !fileName) return

    if (inputSourceMap.sourceRoot) inputSourceMap.sourceRoot = ''
    inputSourceMap.sources = inputSourceMap.sources.map(source => (source.includes(fileName) ? absolutePath : source))
  })
}

/**
 * Removes support file from the coverage object.
 * If there are more files loaded from support folder, also removes them
 * @param {object} totalCoverage
 */
function filterSupportFilesFromCoverage(totalCoverage, config) {
  const { supportFile, supportFolder, integrationFolder } = config

  const isSupportFile = filename => filename === supportFile

  let coverage = omitBy(totalCoverage, (fileCoverage, filename) => isSupportFile(filename))

  // check the edge case
  //   if we have files from support folder AND the support folder is not same
  //   as the integration, or its prefix (this might remove all app source files)
  //   then remove all files from the support folder
  if (!integrationFolder.startsWith(supportFolder)) {
    // remove all covered files from support folder
    coverage = omitBy(totalCoverage, (fileCoverage, filename) => filename.startsWith(supportFolder))
  }
  return coverage
}

/**
 * remove coverage for the spec files themselves,
 * only keep "external" application source file coverage
 */
function filterSpecsFromCoverage(totalCoverage, config) {
  const integrationFolder = config.integrationFolder
  /** @type {string | string[]} Cypress run-time config has test files string pattern */
  const testFilePattern = config.testFiles

  // test files chould be:
  //  wild card string "**/*.*" (default)
  //  wild card string "**/*spec.js"
  //  list of wild card strings or names ["**/*spec.js", "spec-one.js"]
  const testFilePatterns = Array.isArray(testFilePattern) ? testFilePattern : [testFilePattern]

  const isUsingDefaultTestPattern = testFilePattern === '**/*.*'

  const isTestFile = filename => {
    const matchedPattern = testFilePatterns.some(specPattern => Cypress.minimatch(filename, specPattern))
    const matchedEndOfPath = testFilePatterns.some(specPattern => filename.endsWith(specPattern))
    return matchedPattern || matchedEndOfPath
  }

  const isInIntegrationFolder = filename => filename.startsWith(integrationFolder)

  const isA = (fileCoverge, filename) => isInIntegrationFolder(filename)
  const isB = (fileCoverge, filename) => isTestFile(filename)

  const isTestFileFilter = isUsingDefaultTestPattern ? isA : isB

  return omitBy(totalCoverage, isTestFileFilter)
}
