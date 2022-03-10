jest.mock('../components/hooks/useClientParams', () => jest.fn())

describe('loadGoogleApi', () => {
  let mockScriptElement
  let oldParams
  const tenantId = 'testtenant1'
  const apiKey = 'abc'

  beforeAll(() => {
    oldParams = window.parameters
  })

  beforeEach(() => {
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      addEventListener: jest.fn(),
    }))
    jest.spyOn(document, 'getElementsByTagName').mockImplementation(() => [
      {
        parentNode: {
          insertBefore: jest.fn(s => {
            mockScriptElement = s
          }),
        },
      },
    ])
  })

  afterEach(() => {
    window.parameters = oldParams
    // make each require('./loadGoogleApi') a fresh invocation
    jest.resetModules()
    jest.restoreAllMocks()
    mockScriptElement = undefined
  })

  it("doesn't bother loading if window.google exists", async () => {
    window.google = { apiKey }

    const GoogleApiLoaded = require('./loadGoogleApi.js').default
    await expect(GoogleApiLoaded({ apiKey })).toBe(window.google)
    expect(document.createElement).not.toHaveBeenCalled()
  })

  it('reloads if apiKeys do not match', async () => {
    window.google = {}
    require('./loadGoogleApi.js').default({ apiKey })

    const GoogleApiLoaded = require('./loadGoogleApi.js').default({ apiKey: 'hello' })

    window.google = {}
    window.googleMapsApiLoaded()
    await expect(GoogleApiLoaded.promise).resolves.toBe(window.google)
    expect(window.google).toEqual({ apiKey: 'hello' })
  })

  describe('parameters test cases', () => {
    beforeEach(() => {
      window.google = undefined
    })

    it('Fails if window parameters has no maps key', async () => {
      const GoogleApiLoaded = require('./loadGoogleApi.js').default
      await expect(() => GoogleApiLoaded(undefined)).toThrow(/Invalid/)
    })

    it('Fails if window parameters has no apiKey', async () => {
      const GoogleApiLoaded = require('./loadGoogleApi.js').default
      await expect(() => GoogleApiLoaded({})).toThrow(/Invalid/)
    })
  })

  describe('loading cases', () => {
    let GoogleApiLoaded
    let calls

    beforeEach(async () => {
      window.google = undefined
      GoogleApiLoaded = require('./loadGoogleApi.js').default({ apiKey })

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
      window.google = { tenantId }
      window.googleMapsApiLoaded()
      await expect(GoogleApiLoaded.promise).resolves.toBe(window.google)
    })
  })
})
