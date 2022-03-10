import 'cypress'
import 'cypress-storybook/cypress'
import '@testing-library/cypress/types'

import type { PathLike } from 'fs'
import type { TFunction, TOptions } from 'i18next'

import type { ByRoleOptions } from '@testing-library/cypress'
import type { ByRoleMatcher, ByRoleOptions as DTLByRoleOptions } from '@testing-library/dom'

interface TStringFunction extends TFunction {
  <TKeys extends TFunctionKeys = string>(key: TKeys | TKeys[], options?: TOptions<any> | string): string
  // overloaded usage
  <TKeys extends TFunctionKeys = stringp>(key: TKeys | TKeys[], defaultValue?: string, options?: TOptions<any> | string): string
}

type TestingLibraryApis =
  | 'findAllByAltText'
  | 'findAllByLabelText'
  | 'findAllByPlaceholderText'
  | 'findAllByRole'
  | 'findAllByText'
  | 'findAllByTitle'
  | 'findAllByDisplayValue'
  | 'findByAltText'
  | 'findByDisplayValue'
  | 'findByLabelText'
  | 'findByPlaceholderText'
  | 'findByRole'
  | 'findByText'
  | 'findByTitle'

type TestingLibraryChainable<Subject> = Cypress.Chainable<Subject> &
  {
    [k in TestingLibraryApis]: (...args: Parameters<Cypress.Chainable<Subject>[k]>) => Promise<Cypress.Chainable<Subject>>
  }

type MatcherOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
// eslint-disable-next-line @typescript-eslint/no-explicit-any

type Matcher = any
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Renamed command to l
       */
      say: Cypress.Chainable<Subject>['log']

      /**
       * Custom command to load I18N namespaces.
       * @param ns namespaces
       */
      loadI18nNamespaces(...ns: string[]): Chainable<TFunction>

      translate: TStringFunction

      /**
       * Custom command to click outside a modal element.
       * @example cy.clickOutsideModal()
       */
      clickOutsideModal(): void

      /** @deprecated */
      findByLocator(id: Matcher, options?: MatcherOptions): Chainable<Subject>
      /** @deprecated */
      findByLocator(id: Matcher, options?: MatcherOptions): Promise<Chainable<Subject>>
      /** @deprecated */
      findAllByLocator(id: Matcher, options?: MatcherOptions): Chainable<Subject>
      /** @deprecated */
      findAllByLocator(id: Matcher, options?: MatcherOptions): Promise<Chainable<Subject>>

      /**
       * Custom command to find all infinite table cells by column label.
       * @example cy.findAllByInfiniteTableColumnLabel('column name')
       */
      findAllByInfiniteTableColumnLabel(colLabel: DTLByRoleOptions['name']): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to find sort button inside infinite table header cells by column/button label.
       * @example cy.findSortButtonByInfiniteTableColumnLabel('column name')
       */
      findSortButtonByInfiniteTableColumnLabel(colLabel: DTLByRoleOptions['name']): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to find file in specific folder.
       * @example cy.seeDownloadedFile('filePath')
       */
      seeDownloadedFile(filePath: string): boolean

      /**
       * Custom command to delete folder and all it's subfolders (recursively)
       * @example cy.deleteFolder('folderPath')
       */
      deleteFolder(folderPath: PathLike): void | null

      /**
       * Custom command to upload file from fixture folder
       * Should be chained after element
       * @example I.findByLabelText('labeled-file-upload-button').uploadFile('importFile.csv', 'text/csv')
       * @return element - after which this command was chained
       */
      uploadFile(fileName: string, fileType: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to find a table cell by row index, column index
       * @example cy.findAllByInfiniteTableColumnLabel('column name')
       */
      findByInfiniteTableCell(rowIndex: number, colIndex: number): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to find an XGrid table header by column index. Index starts with 1.
       * @example cy.findByXGridHeader(1)
       */
      findByXGridHeader(columnIndex: number): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to find all table cells by column label.
       * @param {DTLByRoleOptions['name']} colLabel Column label
       * @param {index} index Column index (optional)
       * @example cy.findAllByTableColumnLabel('column name')
       */
      findAllByTableColumnLabel(colLabel: DTLByRoleOptions['name'], index?: number): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to find a role inside a container.
       * @example cy.findByRoleWithin('presentation', 'button', {name: name_regex})
       */
      findByRoleWithin(container: string, role: string, options?: ByRoleOptions): Chainable<Element>

      /**
       * Custom command to find a role inside a container.
       * @example cy.findByRoleOptionsWithin('columnheader', {name: container_name}, 'button', {name: name_regex})
       */
      findByRoleOptionsWithin(
        container: string,
        containerOptions: ByRoleOptions,
        role: string,
        options?: ByRoleOptions,
      ): Chainable<Element>

      /**
       * Custom command to dismiss error/success alert.
       * @example cy.dismissAlert()
       */
      dismissAlert(): void

      /**
       * Custom command to set the permission to override
       * @param permissions
       *   Object where the key is the permission and the value is true/false
       *   Example {'Ues:Ecs:Users:Read':true, 'Ues:Ecs:Users:Create':false},
       * this will override the permission 'Ues:Ecs:Users:Read' to true if in the UES session it is false.
       */
      overridePermissions(permissions): void

      /**
       * Custom command to change Select (from behaviours) value
       */
      changeSelectValue(selectLabel: string, visibleValueToSelect: string): void

      visitRoute(
        path: string,
        state?: Record<string, unknown>,
        options?: Partial<Cypress.Loggable> & { routerHistory?: string },
      ): void

      fillField(
        text: string,
        options?: {
          force?: boolean
          timeout?: number
        },
      ): Chainable<Subject>
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any
    export interface ChainableI<Subject = any>
      extends Pick<
        Cypress.Chainable<Subject>,
        | 'changeArg'
        | 'findAllByAltText'
        | 'findAllByLabelText'
        | 'findAllByPlaceholderText'
        | 'findAllByRole'
        | 'findAllByText'
        | 'findAllByTitle'
        | 'findAllByDisplayValue'
        | 'findByAltText'
        | 'findByDisplayValue'
        | 'findByLabelText'
        | 'findByPlaceholderText'
        | 'findByRole'
        | 'findByText'
        | 'findByTitle'
        | 'queryAllByRole'
        | 'fixture'
        | 'go'
        | 'intercept'
        | 'loadStory'
        | 'location'
        | 'reload'
        | 'visit'
        | 'visitStorybook'
        | 'wait'
        | 'window'
        | 'within'
        | 'wrap'
        | 'url'
        // 'get' - DISABLED ON PURPOSE. Please use findBy...() methods

        // Custom :
        | 'changeSelectValue'
        | 'clickOutsideModal'
        | 'deleteFolder'
        | 'uploadFile'
        | 'findAllByInfiniteTableColumnLabel'
        | 'findAllByLocator'
        | 'findAllByTableColumnLabel'
        | 'findByInfiniteTableCell'
        | 'findByLocator'
        | 'findByRoleOptionsWithin'
        | 'findByRoleWithin'
        | 'findByXGridHeader'
        | 'findSortButtonByInfiniteTableColumnLabel'
        | 'loadI18nNamespaces'
        | 'overridePermissions'
        | 'queryAllByRole'
        | 'say'
        | 'seeDownloadedFile'
        | 'translate'
        | 'visitRoute'

        // Actions :
        | 'mockAll'

        // Not supported by testing-library.
        //
        // | 'queryAllByAltText'
        // | 'queryAllByDisplayValue'
        // | 'queryAllByLabelText'
        // | 'queryAllByPlaceholderText'
        // | 'queryAllByText'
        // | 'queryAllByTitle'
        // | 'queryByAltText'
        // | 'queryByDisplayValue'
        // | 'queryByLabelText'
        // | 'queryByPlaceholderText'
        // | 'queryByRole'
        // | 'queryByText'
        // | 'queryByTitle'
      > {}

    type I = Cypress.ChainableI & EventEmitter
  }

  const I: Cypress.I
}
