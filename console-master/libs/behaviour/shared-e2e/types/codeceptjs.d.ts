/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types='codeceptjs' />
/// <reference types='webdriverio/async' />
/// <reference types='node' />
/// <reference types='chai' />
/// <reference types='chai-as-promised' />

type steps_file = typeof import('../src/codeceptjs/customSteps')
type FileSystem = import('codeceptjs/lib/helper/FileSystem')
type PlaywrightElement = import('playwright-testing-library/dist/typedefs').ElementHandle
type Chainable = import('../src/codeceptjs/testing-library/Base').Chainable<PlaywrightElement | WebdriverIO.Element>

interface SetupHeadlessHelper {}

declare namespace CodeceptJS {
  interface Step {
    container?: ContainerType
    as?: string
    startTime: number
    endTime: number
    shouldThrow?: any[]
  }
  interface SupportObject {
    CodeceptJS: I
    I: I
    current: any
    login: (name: 'admin' | 'rbac-admin' | 'rbac-read-only' | 'rbac-create' | 'rbac-update' | 'rbac-delete') => Promise<void>
  }
  interface Methods
    extends Chainable,
      SetupHeadlessHelper,
      FileSystem,
      Pick<
        Playwright,
        | 'appendField'
        | 'checkOption'
        | 'clearCookie'
        | 'clearField'
        | 'clearField'
        | 'click'
        // | 'dontSee'
        // | 'dontSeeCheckboxIsChecked'
        // | 'dontSeeCookie'
        // | 'dontSeeElement'
        // | 'dontSeeElementInDOM'
        // | 'dontSeeInField'
        // | 'dontSeeInTitle'
        | 'doubleClick'
        | 'dragAndDrop'
        | 'dragSlider'
        // | 'fillField'
        // | 'forceClick'
        // | 'grabBrowserLogs' //or is other way ?
        | 'grabCookie'
        // | 'grabTextFrom'
        // | 'grabValueFrom'
        // | 'grabValueFromAll'
        // | 'handleDownloads'
        // | 'moveCursorTo'
        // | 'scrollTo'
        | 'see'
        | 'seeInCurrentUrl'
        // | 'seeTextEquals'
        // | 'selectOption'
        | 'setCookie'
        | 'type',
        // | 'uncheckOption'
        'waitForVisible'
      >,
      Partial<Pick<Playwright, 'usePlaywrightTo'>>,
      Partial<Pick<WebDriver, 'useWebDriverTo'>> {}
  interface I extends ReturnType<steps_file>, WithTranslation<SetupHeadlessHelper>, WithTranslation<FileSystem> {}
  namespace Translation {
    interface Actions {}
  }
}

declare namespace NodeJS {
  interface Global {
    I: CodeceptJS.I
  }
}

declare const I: CodeceptJS.I
declare const assert: Chai.AssertStatic
declare const expect: Chai.ExpectStatic
declare const should: Chai.Should

declare const window: any
declare const localStorage: any
declare const sessionStorage: any
