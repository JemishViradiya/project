/* global cy */
/* eslint-disable no-restricted-globals */

import './compat'

import type { PathLike } from 'fs'
import type { History } from 'history'
import type { StringMap, TFunction, TOptions } from 'i18next'

import type { ByRoleOptions } from '@testing-library/dom'

import { loadNamespaces } from '../i18n'
import {
  changeSelectValue,
  dismissAlert,
  findAllByInfiniteTableColumnLabel,
  findAllByTableColumnLabel,
  findByInfiniteTableCell,
  findByRoleOptionsWithin,
  findByRoleWithin,
  findByXGridHeader,
  findSortButtonByInfiniteTableColumnLabel,
} from './shared'

let tFunction: TFunction

const I: Cypress.ChainableI = (cy as unknown) as Cypress.ChainableI

function loadI18nNamespaces(...ns) {
  return cy.then(async () => {
    tFunction = await loadNamespaces(...ns)
    return tFunction
  })
}

function clickOutsideModal() {
  return cy.get('body').click(0, 0)
}

function overridePermissions(permissions) {
  // storage.setItem does not work for Chrome to trigger the storage event (in Dev Console as well)
  // however but postMessage works so using this for Chrome.  If in future this does not work for Cypress.
  // then tests will fail.. so this is a bit fragile!
  cy.then(() => {
    if (Cypress.isBrowser('chrome')) {
      cy.window().then(win => {
        win.postMessage(
          {
            override: 'UES_permissionOverrides',
            value: permissions,
          },
          '*',
        )
      })
      // Firefox and Electron under Cypress does not work with postMessage/dispatch for some reason
      // (but WORKS when executing it manually the Dev Console in Cypress browser instance...)
      // However, both Firefox/Electron works well with localStorage.setItem so using that instead
    } else {
      cy.window().then(win => {
        win.localStorage.setItem('UES_permissionOverrides', JSON.stringify(permissions ? permissions : {}))
        // appears this is something needed for Electron in some cases.. so putting this in as well..
        win.postMessage(
          {
            override: 'UES_permissionOverrides',
            value: permissions,
          },
          '*',
        )
      })
    }
  })
  // Don't fail test if PermissionError was thrown
  cy.on('uncaught:exception', (error: Error) => {
    if (error?.constructor?.name === 'PermissionError' || error?.message.includes('Needed permissions')) {
      return false
    }
  })
}

function t(key: string | string[], options?: string | TOptions<StringMap>): string {
  if (!tFunction) {
    throw new Error('tFunction not defined. Please, load i18n namespaces before using this method.')
  }

  return tFunction(key, options)
}

function seeDownloadedFile(filePath) {
  return cy.task('seeDownloadedFile', filePath)
}

function deleteFolder(filePath: PathLike) {
  return cy.task('deleteFolder', filePath)
}

function uploadFile(subject, fileName, fileType) {
  I.fixture(fileName, 'base64')
    .then(Cypress.Blob.base64StringToBlob)
    .then(blob => {
      const el = subject[0]
      const testFile = new File([blob], fileName, { type: fileType })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(testFile)
      el.files = dataTransfer.files
      return I.wrap(subject).trigger('change', { force: true })
    })
}

Cypress.Commands.add(
  'uploadFile',
  {
    prevSubject: 'element', // receives the previous subject and it's guaranteed to be an element
  },
  (subject, fileName, fileType) => {
    return uploadFile(subject, fileName, fileType)
  },
)

Cypress.Commands.add('seeDownloadedFile', seeDownloadedFile)

Cypress.Commands.add('deleteFolder', deleteFolder)

function visitRoute(
  path: string,
  state?: Record<string, any>,
  options?: Partial<Cypress.Loggable> & { routerHistory?: string },
): void {
  const shouldLog = options?.log

  cy.window().then(window => {
    const history = window[options?.routerHistory] as Pick<History, 'push'>

    if (shouldLog !== false)
      Cypress.log({
        name: 'navigate',
        displayName: 'Navigate',
        message: [path],
        consoleProps: () => ({
          path,
          state,
          used: history ? 'history.push' : 'window.history.pushState',
          instance: history ?? window.history,
        }),
      })

    if (history) {
      history.push(path, state)
    } else {
      window.location.hash = `#${path}`
    }
  })
}

Cypress.Commands.add('visitRoute', visitRoute)

Cypress.Commands.add('loadI18nNamespaces', loadI18nNamespaces)

Cypress.Commands.add('clickOutsideModal', clickOutsideModal)

Cypress.Commands.add('findAllByInfiniteTableColumnLabel', findAllByInfiniteTableColumnLabel)

Cypress.Commands.add('findSortButtonByInfiniteTableColumnLabel', findSortButtonByInfiniteTableColumnLabel)

Cypress.Commands.add('findByInfiniteTableCell', findByInfiniteTableCell)

Cypress.Commands.add('findAllByTableColumnLabel', findAllByTableColumnLabel)

Cypress.Commands.add('findByXGridHeader', findByXGridHeader)

Cypress.Commands.add('findByRoleWithin', findByRoleWithin)

Cypress.Commands.add('findByRoleOptionsWithin', findByRoleOptionsWithin)

Cypress.Commands.add('dismissAlert', dismissAlert)

Cypress.Commands.add('changeSelectValue', changeSelectValue)

Cypress.Commands.add('overridePermissions', overridePermissions)

Object.assign(I, { translate: t })

Object.assign(globalThis, { I })

export { I }

globalThis.Feature = (name: string) => {
  globalThis.___Feature = {
    name,
    scenarios: [],
  }
}
globalThis.Scenario = (
  name: string,
  handler: ({ I }: { I: Cypress.ChainableI<any> }, ...args: unknown[]) => Promise<void> | void,
) => {
  globalThis.__Feature.scenarios.push(() => it(name, (...args) => handler({ I }, ...args)))
}
