if (!process.env.NODE_CONFIG_ENV) {
  process.env.NODE_CONFIG_ENV = 'development'
}

require('ts-node/register')
require('tsconfig-paths/register')

const path = require('path')
const getUuid = require('uuid-by-string')
const { setHeadlessWhen, setTestHost, setWindowSize } = require('@codeceptjs/configure')
const Config = loadConfig()
const createAutoLogin = require('./libs/behaviour/shared-e2e/src/codeceptjs/autoLogin').autoLogin
const reporterUtils = require('@codeceptjs/ui/lib/codeceptjs/reporter-utils')

const makeBoolean = (obj, prop) => {
  const value = obj[prop]
  if (typeof value === 'string') {
    obj[prop] = value === 'true'
  }
}

const { headless, plugin, [plugin]: pluginConfig, ...codeceptConfig } = Object.assign(
  {
    browser: 'chromium',
    waitForAction: 100,
    keepCookies: true,
    keepBrowserState: true,
    waitForNavigation: 'domcontentloaded',
    trace: true,
  },
  Config.runner.codecept,
)
makeBoolean(codeceptConfig, 'slow')

setHeadlessWhen(headless === 'true' || headless === true)
setWindowSize(1440, 1080)
setTestHost(Config.e2e.config.baseUrl)

console.log('Using helper', plugin)

const actionSteps = new Set(['screenshot', 'visit', 'amOnPage', 'click', 'type', 'fillField', 'appendField', 'pressKey', 'select'])
reporterUtils.isScreenshotStep = step => {
  if (step.name.match(/^wait/)) return true
  if (step.name.match(/^should/)) return true
  if (step.name.match(/^see/)) return true
  if (step.name.match(/^find/)) return true
  if (step.name.match(/^use/)) return true
  if (step.name.match(/^dontSee/)) return true
  return actionSteps.has(step.name)
}

/** @type {import('./libs/behaviour/shared-e2e/types/codecept.conf').Config} */
exports.config = name => {
  const isCI = process.env.CI === 'true'
  let outputDir = './output'
  const reportsDir = path.join(__dirname, 'codeceptjs-results', name)
  const mochaExtraOptions = {}
  const helpers = {
    TestingLibrary: {
      require: require.resolve(`./libs/behaviour/shared-e2e/src/codeceptjs/testing-library/${plugin}`),
    },
    FileSystem: {
      require: require.resolve('codeceptjs/lib/helper/FileSystem'),
    },
  }
  if (isCI) {
    outputDir = reportsDir
    Object.assign(mochaExtraOptions, {
      reporter: 'mocha-multi',
      reporterOptions: {
        'codeceptjs-cli-reporter': {
          stdout: '-',
          options: {
            steps: true,
          },
        },
        'mocha-junit-reporter': {
          stdout: path.join(reportsDir, 'console.log'),
          options: {
            mochaFile: path.join(reportsDir, 'junit-report.xml'),
            attachments: true, //add screenshot for a failed test
          },
        },
      },
    })
  }
  const region = process.env.NODE_CONFIG_ENV
  const tier = process.env.CI_ENVIRONMENT_TIER || 'other'
  setReportalLaunchId(`${process.env.CI_PIPELINE_ID}-${name}`)

  const CodeceptJSConfig = {
    name,
    tests: './integration/**/*.spec.ts',
    output: outputDir,
    include: {
      I: require.resolve('./libs/behaviour/shared-e2e/src/codeceptjs/customSteps'),
    },
    watchFiles: [
      path.join(__dirname, 'libs/behaviour/shared-e2e/src/pages/**/*.ts'),
      './test/pages/**/*.ts',
      './src/pages/**/*.ts',
    ],
    helpers: {
      [plugin]: {
        ...pluginConfig,
        url: Config.e2e.config.baseUrl,
        config: Config,
        chromium: {
          // necessary to launch the browser in normal mode instead of incognito
          userDataDir: cacheDir(`codeceptjs-chromium`),
          //   // args: ['--disable-dev-shm-usage'],
        },
        chrome: {
          userDataDir: cacheDir(`codeceptjs-chromium`),
        },
      },
      ...helpers,
    },
    plugins: {
      autoLogin: {
        enabled: true,
        saveToFile: true,
        inject: 'login',
        users: Object.entries(Config.e2e.config.users || []).reduce((agg, [alias, data]) => {
          agg[alias] = createAutoLogin({ region, ...data })
          return agg
        }, {}),
        customLocator: {
          enabled: true,
          attribute: 'role',
        },
      },
      autoDelay: {
        enabled: true,
      },
      screenshotOnFail: {
        enabled: true,
        uniqueScreenshotNames: false,
      },
      reportportal: {
        enabled: isCI,
        require: '@reportportal/agent-js-codecept',
        token: process.env.REPORTAL_TOKEN,
        endpoint: 'http://ebreportportal.devlab2k.testnet.rim.net/api/v1',
        projectName: 'ues-console',
        launchName: `CodeceptJS ${name}`,
        launchDescription: `UES Console Integration Tests for ${name} (sha: ${process.env.CI_COMMIT_SHORT_SHA})`,
        // TODO: support re-runs
        rerunOf: process.env.RP_LAUNCH_ID,
        launchAttributes: [
          {
            value: tier,
          },
          {
            value: region,
          },
          {
            key: 'browser',
            value: codeceptConfig.browser,
          },
          {
            key: 'project',
            value: name,
          },
        ],
      },
      retryFailedStep: {
        enabled: true,
      },
    },
    bootstrap: null,
    mocha: {
      fullStackTrace: true,
      bail: false,
      ...mochaExtraOptions,
    },
    ...codeceptConfig,
  }
  // console.log('CONFIG', process.cwd(), CodeceptJSConfig)
  return CodeceptJSConfig
}

if (plugin === 'Playwright') {
  // remove silly log messages
  const proto = require('codeceptjs/lib/helper/Playwright').prototype
  const code = proto._after.toString().replace('this.browser.contexts()', '(this.browser.contexts ? this.browser.contexts() : [])')
  proto._after = eval(code.replace('async _after', 'async function _after') + '_after')
}

function loadConfig() {
  if (!global.Config) {
    if (!process.env.NODE_CONFIG_DIR) {
      process.env.NODE_CONFIG_DIR = require('path').resolve(__dirname, 'config', 'codeceptjs')
    }
    console.log('Loading config "%s"', process.env.NODE_CONFIG_ENV)
    const baseConfig = require('config')
    global.Config = JSON.parse(JSON.stringify(baseConfig))
    console.log('Loaded config for site "%s"', global.Config.e2e.config.baseUrl)
  }
  return global.Config
}

function cacheDir(name) {
  const path = require('path')
  const base = process.env.PLAYWRIGHT_PROFILES_DIR
    ? path.resolve(__dirname, process.env.PLAYWRIGHT_PROFILES_DIR)
    : path.join(__dirname, 'node_modules', '.cache')
  return path.join(base, name)
}

function setReportalLaunchId(name) {
  process.env.RP_LAUNCH_ID = getUuid(name)
}

process.on('unhandledRejection', (reason, promise) => {
  console.trace(reason)
})
