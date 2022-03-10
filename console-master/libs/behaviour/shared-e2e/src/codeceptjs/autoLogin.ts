import CylanceLoginPage from './pages/login/CylanceLoginPage'

type CodeceptJS_I = CodeceptJS.SupportObject['I'] & (CodeceptJS.Playwright | CodeceptJS.WebDriver)

export const autoLogin = (opts: { email: string; password: string; region: string }) => ({
  login: (I: CodeceptJS_I) => {
    const { baseUrl } = I.getTestConfig()
    const loginUrl = baseUrl.replace('protect.cylance.com', 'login.cylance.com')
    I.say(`Login from ${loginUrl}: ${JSON.stringify(opts)}`)

    I.clearCookie()
    I.visit(loginUrl)
    CylanceLoginPage.fillLoginForm(I, opts)
    I.seeInCurrentUrl(baseUrl)
  },
  check: (I: CodeceptJS_I) => {
    const { baseUrl } = I.getTestConfig()

    I.visit('/')
    I.seeInCurrentUrl(baseUrl)
    I.waitForVisible('main', 10)
    I.seeInCurrentUrl(baseUrl)
  },
  // fetch: I => I.grabCookie(),
  // restore: (I, cookies) => {
  //   I.amOnPage('/'); // open a page
  //   I.setCookie(cookies);
  // },
  restore: (I: CodeceptJS_I, cookies: CodeceptJS.Cookie[]) => {
    if (I.usePlaywrightTo) {
      const fn = async ({ browserContext }: { browserContext: import('playwright').BrowserContext }) => {
        await browserContext.addCookies(cookies)
      }
      fn.toString = () => '{venue-session}'
      I.usePlaywrightTo('set cookies', fn)
    } else if (I.useWebDriverTo) {
      const fn = async ({ browser }: { browser: import('webdriverio').Browser<'async'> }) => {
        await browser.setCookies(cookies)
      }
      fn.toString = () => '{venue-session}'
      I.useWebDriverTo('set cookies', fn)
    } else {
      I.visit('/')
      I.setCookie(cookies)
    }
  },
})
