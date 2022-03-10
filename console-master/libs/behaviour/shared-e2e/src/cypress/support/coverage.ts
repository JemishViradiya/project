/* eslint-disable no-restricted-globals */
/* modified from https://github.com/cypress-io/code-coverage */

const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')

dayjs.extend(duration)

type CoverageObj = Record<string, unknown>

const logTasks = false

/**
 * Sends collected code coverage object to the backend code
 * via "cy.task".
 */
function combineTestCoverage(coverages?: Array<{ coverage: CoverageObj; pathname?: string }>) {
  invokeTask('combineCoverage', JSON.stringify(coverages || []))
}

/**
 * Consistently logs the given string to the Command Log
 * so the user knows the log message is coming from this plugin.
 * @param {string} s Message to log.
 */
function logMessage(s: string) {
  cy.log(`${s} \`[@cypress/code-coverage]\``)
}

function registerHooks() {
  let windowCoverageObjects

  const hasE2ECoverage = () => Boolean(windowCoverageObjects && windowCoverageObjects.length)

  const hasUnitTestCoverage = () => Boolean(window['__coverage__'])

  before(function beforeResetCoverage() {
    // we need to reset the coverage when running
    // in the interactive mode, otherwise the counters will
    // keep increasing every time we rerun the tests
    invokeTask('resetCoverage', {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isInteractive: Cypress.config('isInteractive'),
    })
  })

  beforeEach(function hookPageLoadForCoverage() {
    // each object will have the coverage and url pathname
    // to let the user know the coverage has been collected
    windowCoverageObjects = []

    function saveCoverageObject(win: Window) {
      try {
        // if application code has been instrumented, the app iframe "window" has an object
        const applicationSourceCoverage = win['__coverage__']
        if (!applicationSourceCoverage) {
          return
        }

        if (
          Cypress._.find(windowCoverageObjects, {
            coverage: applicationSourceCoverage,
          })
        ) {
          // this application code coverage object is already known
          // which can happen when combining `window:load` and `before` callbacks
          return
        }

        collectTestCoverage()
        windowCoverageObjects.push({
          coverage: applicationSourceCoverage,
          pathname: win.location.pathname,
        })
      } catch (error) {
        console.trace(error.message)
      }
    }

    // save reference to coverage for each app window loaded in the test
    cy.on('window:load', saveCoverageObject)

    // save reference if visiting a page inside a before() hook
    cy.window({ log: logTasks }).then(saveCoverageObject)
  })

  afterEach(collectTestCoverage)

  function collectTestCoverage() {
    const coverages = [...windowCoverageObjects]
    windowCoverageObjects = []
    console.log('collectTestCoverage: ' + coverages.length)

    combineTestCoverage(coverages)
  }
}

// to disable code coverage commands and save time
// pass environment variable coverage=false
//  cypress run --env coverage=false
// or
//  CYPRESS_coverage=false cypress run
// see https://on.cypress.io/environment-variables

// to avoid "coverage" env variable being case-sensitive, convert to lowercase
const cyEnvs = Cypress._.mapKeys(Cypress.env(), (value, key) => key.toLowerCase())

if (cyEnvs.coverage === false || process.env.NODE_ENV === 'development') {
  before(function registerHooksDisabled() {
    logMessage('Skipping code coverage hooks')
  })
} else if (Cypress.env('codeCoverageTasksRegistered') !== true) {
  // register a hook just to log a message
  before(function registerHooksNotSetup() {
    logMessage(`
      ⚠️ Code coverage tasks were not registered by the plugins file.
      See [support issue](https://github.com/cypress-io/code-coverage/issues/179)
      for possible workarounds.
    `)
  })
} else {
  registerHooks()
}

function invokeTask(task: string, args: Record<string, any> | string | Buffer | ArrayBufferView) {
  const logInstance = Cypress.log({
    name: 'Coverage',
    message: [`${logTasks} [@cypress/code-coverage]`],
  })

  cy.task(task, args).then(function invokeTaskFinalize() {
    logInstance.end()
  })
}

/**
 * Removes support file from the coverage object.
 * If there are more files loaded from support folder, also removes them
 */
function filterSupportFilesFromCoverage(totalCoverage: CoverageObj) {
  const integrationFolder = Cypress.config('integrationFolder')
  const supportFile = Cypress.config('supportFile')

  /** @type {string} Cypress run-time config has the support folder string */
  const supportFolder: string = Cypress.config('supportFolder')

  const isSupportFile = filename => filename === supportFile

  let coverage = Cypress._.omitBy(totalCoverage, (fileCoverage, filename) => isSupportFile(filename))

  // check the edge case
  //   if we have files from support folder AND the support folder is not same
  //   as the integration, or its prefix (this might remove all app source files)
  //   then remove all files from the support folder
  if (!integrationFolder.startsWith(supportFolder)) {
    // remove all covered files from support folder
    coverage = Cypress._.omitBy(totalCoverage, (fileCoverage, filename) => filename.startsWith(supportFolder))
  }
  return coverage
}

/**
 * remove coverage for the spec files themselves,
 * only keep "external" application source file coverage
 */
function filterSpecsFromCoverage(totalCoverage, config = Cypress.config) {
  const integrationFolder = config('integrationFolder')
  /** @type {string} Cypress run-time config has test files string pattern */
  const testFilePattern = config('testFiles')

  // test files chould be:
  //  wild card string "**/*.*" (default)
  //  wild card string "**/*spec.js"
  //  list of wild card strings or names ["**/*spec.js", "spec-one.js"]
  const testFilePatterns = Array.isArray(testFilePattern) ? testFilePattern : [testFilePattern]

  const isUsingDefaultTestPattern = testFilePattern === '**/*.*'

  function isTestFile(filename: string) {
    const matchedPattern = testFilePatterns.some(specPattern => Cypress.minimatch(filename, specPattern))
    const matchedEndOfPath = testFilePatterns.some(specPattern => filename.endsWith(specPattern))
    return matchedPattern || matchedEndOfPath
  }

  const isInIntegrationFolder = filename => filename.startsWith(integrationFolder)

  const isA = (fileCoverge, filename) => isInIntegrationFolder(filename)
  const isB = (fileCoverge, filename) => isTestFile(filename)

  const isTestFileFilter = isUsingDefaultTestPattern ? isA : isB

  return Cypress._.omitBy(totalCoverage, isTestFileFilter)
}
