import '@testing-library/jest-dom'

describe('loadGoogleApi', () => {
  let mockScriptElement
  let oldParams
  const tenantId = 'testtenant1'
  const apiKey = 'abc'
  const importModule = import('./useGoogleMapsApi')
  beforeAll(() => {
    oldParams = (window as any).parameters
  })

  beforeEach(() => {
    jest.spyOn(document, 'createElement').mockImplementation(
      () =>
        ({
          addEventListener: jest.fn(),
        } as any),
    )
    jest.spyOn(document, 'getElementsByTagName').mockImplementation(
      () =>
        [
          {
            parentNode: {
              insertBefore: jest.fn((s => {
                mockScriptElement = s
              }) as any),
            },
          },
        ] as any,
    )
  })

  afterEach(() => {
    ;(window as any).parameters = oldParams
    // make each require('./loadGoogleApi') a fresh invocation
    jest.resetModules()
    jest.restoreAllMocks()
    mockScriptElement = undefined
  })

  it("doesn't bother loading if window.google exists", async () => {
    ;(window as any).google = {
      apiKey,
    }

    const GoogleApiLoaded = (await importModule).default
    console.log(window.google)
    await expect(GoogleApiLoaded(apiKey).apiKey).toBe(apiKey)
    expect(document.createElement).not.toHaveBeenCalled()
  })

  it('reloads if apiKeys do not match', async () => {
    ;(window as any).google = (await importModule).default(apiKey)

    const GoogleApiLoaded = (await importModule).default('newApiKey')

    ;(window as any).google = {}
    window.googleMapsApiLoaded()
    await expect(GoogleApiLoaded.promise).resolves.toBe(window.google)
    expect(window.google).toEqual({ apiKey: 'newApiKey' })
  })

  describe('parameters test cases', () => {
    beforeEach(() => {
      window.google = undefined
    })

    it('Fails if window parameters has no maps key', async () => {
      const GoogleApiLoaded = (await importModule).default
      await expect(() => GoogleApiLoaded(undefined)).toThrow(/Invalid/)
    })

    it('Fails if window parameters has no apiKey', async () => {
      const GoogleApiLoaded = (await importModule).default
      await expect(() => GoogleApiLoaded('')).toThrow(/Invalid/)
    })
  })

  describe('loading cases', () => {
    let GoogleApiLoaded
    let calls

    beforeEach(async () => {
      window.google = undefined
      GoogleApiLoaded = (await importModule).default({ apiKey })

      // that *should* have created our mock script element
      expect(mockScriptElement).toBeDefined()

      // okay -- there should have been 3 calls to addEventListener
      calls = mockScriptElement.addEventListener.mock.calls
      expect(calls).toHaveLength(3)
    })

    afterEach(() => {
      GoogleApiLoaded = undefined
      calls = undefined
    })

    it("abort rejects with 'Aborted'", async () => {
      const badCB = calls.find(([event]) => event === 'abort')[1]
      expect(badCB).toBeDefined()

      badCB()
      await expect(GoogleApiLoaded.promise).rejects.toThrow('Aborted')
    })

    it("abort rejects with 'Timeout", async () => {
      const badCB = calls.find(([event]) => event === 'timeout')[1]
      expect(badCB).toBeDefined()

      badCB()
      await expect(GoogleApiLoaded.promise).rejects.toThrow('Timeout')
    })

    it('abort rejects with other error', async () => {
      const badCB = calls.find(([event]) => event === 'error')[1]
      expect(badCB).toBeDefined()

      const msg = 'Unexplainable Badness'
      badCB(new Error(msg))
      await expect(GoogleApiLoaded.promise).rejects.toThrow(msg)
    })

    it('resolves with the loaded script', async () => {
      ;(window as any).google = { tenantId }
      window.googleMapsApiLoaded()
      await expect(GoogleApiLoaded.promise).resolves.toBe(window.google)
    })
  })
})
