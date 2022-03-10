import { actor } from 'codeceptjs'
import type { StringMap, TFunction, TOptions } from 'i18next'

import * as commands from '../commands/shared'
import { ChainableMethods } from './testing-library/types'

function customSteps() {
  const HelperName = globalThis.Config.runner.codecept.plugin

  let tFunction: TFunction

  const translate = (key: string | string[], options?: string | TOptions<StringMap>): string => {
    if (!tFunction) {
      throw new Error('tFunction not defined. Please, load i18n namespaces before using this method.')
    }

    return tFunction(key, options)
  }

  const I = actor({
    ...commands,
    getTestConfig: () =>
      globalThis.Config.e2e.config as {
        baseUrl: string
        users: Record<string, { email: string; password: string }>
        [k: string]: unknown
      },

    clickWithOptions: function clickWithOptions(locator: CodeceptJS.Locator | string, options: { timeout?: number }) {
      const locatorString = typeof locator === 'string' ? locator : locator.toXPath()
      if (HelperName === 'Playwright') {
        this.usePlaywrightTo('click with options', async ({ page }: { page: import('playwright').Page }) => {
          await page.click(locatorString, options)
        })
      } else {
        const cs = (this as unknown) as CodeceptJS.WebDriver
        cs.defineTimeout({ implicit: 10000, pageLoad: 10000, script: 5000 })
        cs.click(locator)
      }
    },

    loadI18nNamespaces: async function (...ns: string[]): Promise<TFunction> {
      const { loadNamespaces } = await import('./i18n')
      tFunction = await loadNamespaces(...ns)
      return translate
    },

    setLocalStorage: async function (key: string, val: string) {
      await this.executeScript(
        function (args) {
          localStorage.setItem(args.key, args.val)
        },
        { key, val },
      )
    },

    translate,
  })

  const helper = codeceptjs.container.helpers('TestingLibrary')
  ChainableMethods.forEach(key => {
    if (key[0] === '_') return
    I[key] = (id, options) => helper._chain(key, id, options)
  })

  return I
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export = customSteps
