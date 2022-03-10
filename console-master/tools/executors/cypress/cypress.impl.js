Object.defineProperty(exports, '__esModule', { value: true })

const path = require('path')
const process = require('process')
const { default: impl } = require('@nrwl/cypress/src/executors/cypress/cypress.impl')

exports.default = function (options, context, ...args) {
  const isInCI = process.env.CI === 'true' || process.env.CYPRESS_CI_TESTING === 'true'
  const {
    CI_PIPELINE_ID = process.env.USER || 'local',
    CI_JOB_ID = process.pid,
    CI_BUILD_REF_SLUG,
    BROWSER,
    CYPRESS_RECORD_KEY,
    CI_TRIGGER_TARGET,
    CI_MERGE_REQUEST_EVENT_TYPE,
    CI_COMMIT_BRANCH,
  } = process.env

  const { root: nxRoot, projectName, target, workspace } = context
  const projectRoot = workspace.projects[projectName].root
  const projectDir = path.relative(nxRoot, projectRoot)
  const outputDir = path.join(nxRoot, 'dist', 'cypress', projectDir)
  const resultsDir = path.join(nxRoot, 'cypress-results', projectDir)
  const group = `UES-Console/${projectName}`
  const idBase =
    CI_TRIGGER_TARGET && CI_TRIGGER_TARGET !== 'none'
      ? CI_TRIGGER_TARGET
      : CI_MERGE_REQUEST_EVENT_TYPE || CI_COMMIT_BRANCH || 'pipelines'
  const ciBuildId = `${idBase}/${CI_PIPELINE_ID}/${CI_JOB_ID}`

  Object.assign(options, {
    modifyObstructiveCode: false,
    chromeWebSecurity: true,
  })

  if (isInCI) {
    const branchTag = getBranchTag()
    Object.assign(target, {
      outputs: [...target.outputs, /* outputDir, */ resultsDir],
    })
    Object.assign(options, {
      headless: true,
      browser: BROWSER,
      traceWarnings: true,
      downloadsFolder: path.join(outputDir, 'downloads'),
      outputs: [...target.outputs, outputDir, resultsDir],
      // these are applied by @nrwl/cypress
      // screenshotsFolder: path.join(outputDir, 'screenshots'),
      // videosFolder: path.join(outputDir, 'videos'),
      reporter: require.resolve('mocha-multi'),
      reporterOptions: {
        spec: '-',
        [require.resolve('mocha-junit-reporter')]: {
          stdout: path.join(resultsDir, 'junit.log'),
          options: {
            testsuitesTitle: group,
            properties: {
              ciBuildId,
            },
            outputs: true,
            mochaFile: path.join(resultsDir, `test-results-[hash]-${CI_PIPELINE_ID}.xml`),
          },
        },
      },
    })
    if (CYPRESS_RECORD_KEY)
      Object.assign(options, {
        ciBuildId,
        group,
        record: true,
        parallel: true,
        tag: CI_BUILD_REF_SLUG,
      })
  }

  if (process.env.CYPRESS_PROMETHEUS_REPORTING) {
    options.reporterOptions[require.resolve('../../../libs/behaviour/shared-e2e/src/cypress/prometheus')] = {
      stdout: path.join(resultsDir, 'prometheus.log'),
      options: {
        jobName: `cypress_${group.replace(/\//g, '_')}`,
        project: group.replace(/\//g, ':'),
        branch: branchTag,
        runner: 'cypress',
        instance: process.env.CI_RUNNER_DESCRIPTION || process.env.USER || 'local',
        enabled: branchTag !== 'other',
      },
    }
  }
  // console.log('CypressConfig: %o', options)
  return impl(options, context)
}

function getBranchTag() {
  const branch = process.env.CI_COMMIT_BRANCH
  const mrEvent = process.env.CI_MERGE_REQUEST_EVENT_TYPE

  if (branch === 'master') return 'master'
  if (/^epic\//.test(branch)) return 'epic'
  if (mrEvent === 'merge_train') return 'merge-train'
  return 'other'
}
