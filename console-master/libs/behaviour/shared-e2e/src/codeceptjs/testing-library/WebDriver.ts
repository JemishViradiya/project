import type { Browser } from 'webdriverio'

import { setupBrowser } from '@testing-library/webdriverio'

import { Chainable } from './Base'

addCommand('appendField', (el, value: string, options) => el.addValue(value, options))
addCommand('fillField', (el, value: string, options) => el.setValue(value, options))
addCommand('select', (el, value: string) => el.selectByVisibleText(value))

type WebDriverHelper = WebDriver['helpers']['WebDriver']
class WebDriver extends Chainable<WebdriverIO.Element> {
  helpers: {
    WebDriver: Omit<CodeceptJS.WebDriver, '_locate'> & {
      browser: Browser<'async'>
      _locate(loc: CodeceptJS.LocatorOrString): Promise<WebdriverIO.Element[]>
      _getContext(): Promise<any>
    }
  }

  _hooks: WeakMap<WebDriverHelper['browser'], ReturnType<typeof setupBrowser>>

  constructor(config: Record<string, unknown>) {
    super(config)

    this._hooks = new WeakMap()
  }

  hooks(browser = this.helpers.WebDriver.browser) {
    let api = this._hooks.get(browser)
    if (!api) {
      // console.log('setting up browser')
      api = setupBrowser(browser)
      this._hooks.set(browser, api)

      api['$'] = async (...args: [string]) => this.helpers.WebDriver._locate(...args)
    }
    return api
  }

  url() {
    let result = ''
    this.helpers.WebDriver.useWebDriverTo('url', async ({ browser }: WebDriverHelper) => {
      result = await browser.getUrl()
    })
    return result
  }

  visit(url: string) {
    return this.helpers.WebDriver.amOnPage(url)
  }

  _getSubject = async container => {
    let scope

    if (container) {
      const ctr = typeof container === 'function' ? await container() : container
      if (Array.isArray(ctr)) {
        // TODO: handle many
        scope = ctr[0]
      } else {
        scope = ctr
      }
    }
    if (!scope) {
      scope = this.hooks()
    }
    return scope
  }
}

export = WebDriver

function addCommand<TArgs extends any[]>(name: string, handler: (el: WebdriverIO.Element, ...args: TArgs) => Promise<void>) {
  browser.addCommand(
    name,
    async function (...args: TArgs) {
      return handler(this, ...args)
    },
    true,
  )
}
