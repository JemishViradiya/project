import type { ElementHandle, Page } from 'playwright'
import { getDocument, queries } from 'playwright-testing-library'

import { Chainable } from './Base'
import type { AsyncContainerType, ContainerType, Queries } from './types'

function setupPlaywright(helper, prototype) {
  Object.assign(prototype, {
    appendField: prototype.type,
    fillField: prototype.fill,
    select: prototype.selectOption,
    async isExist() {
      try {
        const visible = await this.isVisible()
        if (visible) return true
        const owner = await this.ownerFrame()
        const content = await this.contentFrame()
        return owner && content
      } catch (error) {
        console.log(error)
        return false
      }
    },
  })
}

class TestingLibraryPlaywright extends Chainable<ElementHandle> {
  helpers: {
    Playwright: Omit<CodeceptJS.Playwright, '_locate'> & {
      page: Page
      _locate(loc: CodeceptJS.LocatorOrString): Promise<ElementHandle[]>
      _getContext(): Promise<any>
    }
  }

  _hasSetup: boolean

  url() {
    return this.helpers.Playwright.page.url()
  }

  visit(url: string) {
    return this.helpers.Playwright.amOnPage(url)
  }

  _getQueries() {
    return queries
  }

  _getSubject = async (container: ContainerType): Promise<ElementHandle> => {
    let scope: ElementHandle | undefined = undefined

    if (container) {
      const ctr = typeof container === 'function' ? await (container as AsyncContainerType)() : container
      if (Array.isArray(ctr)) {
        // TODO: handle many
        scope = ctr[0] as ElementHandle
      } else {
        scope = ctr as ElementHandle
      }
    }
    if (!scope) {
      const { page } = this.helpers.Playwright
      scope = await getDocument(page)
      // scope = await page.getDocument()
    }
    if (!this._hasSetup) {
      const { page } = this.helpers.Playwright
      setupPlaywright(this, Object.getPrototypeOf(await getDocument(page)))
    }
    // console.log('scope', scope ? scope['_preview'] : null)
    return scope
  }
}

export = TestingLibraryPlaywright
