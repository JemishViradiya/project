exports.config = {
  tests: './tests/e2e/*.test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      waitForAction: 100,
      chrome: {
        headless: true,
        args: [],
      },
      firefox: {
        headless: true,
        args: [],
        waitForNavigation: 'networkidle0',
      },
    },
    SetupHeadlessHelper: {
      require: './tests/e2e/SetupHeadlessHelper.js',
    },
  },
  bootstrap: null,
  mocha: {},
  name: 'client',
}
