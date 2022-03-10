/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Config {
  tests: string
  output: string
  include?: { [k: string]: string }
  helpers: {
    [k: string]: Record<string, any>
    TestingLibrary?: {
      require: string
      // ... options
    }
    FileSystem?: {
      require: string
      // ... options
    }
  }
  plugins: {
    autoLogin: {
      enabled?: boolean
      saveToFile?: boolean
      inject?: string
      users: {
        [account: string]: typeof import('../src/codeceptjs/autoLogin')
      }
      customLocator?: {
        enabled: boolean
        attribute: 'role'
        [k: string]: any
      }
      [k: string]: any
    }
    autoDelay?: {
      enabled: boolean
      [k: string]: any
    }
    screenshotOnFail?: {
      enabled: boolean
      uniqueScreenshotNames: boolean
      [k: string]: any
    }
    [k: string]: any
  }
  bootstrap: string | null
  mocha?: {
    fullStackTrace?: boolean
    bail?: boolean
    [k: string]: any
  }
  name: 'e2e'
}
