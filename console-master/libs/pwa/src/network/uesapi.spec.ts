export {}

const resolveEnvironment = () => {
  let uesapiModule
  jest.isolateModules(() => {
    uesapiModule = require('./uesapi')
  })
  return uesapiModule.UESAPI_URL
}

const setUrl = domain => {
  const url = new URL(domain)

  Object.defineProperty(globalThis, 'location', {
    writable: true,
    value: {
      href: url.href,
      origin: url.origin,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
    },
  })
}

/**
 * Possible Venue domain patterns
 * https://protect.cylance.com
 * https://protect-euc1.cylance.com
 * https://protect-apne1.cylance.com
 * https://protect-au.cylance.com
 * https://protect-sae1.cylance.com
 * https://protect.us.cylance.com
 * https://qa2-protect.cylance.com
 * https://local-staging-protect.cylance.com
 * https://r00-protect.cylance.com
 * https://r01-protect.cylance.com
 * https://r02-protect.cylance.com
 * https://local-dev-protect.cylance.com
 *
 * Must match to SPAs endpoint pattern
 * {env/region}-uesapi.cylance.com
 */

it('UES API endpoint for US1 region', () => {
  setUrl(`https://protect.cylance.com`)
  const expected = `https://us1-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
  const result = resolveEnvironment()

  expect(result).toEqual(expected)
})

it('UES API endpoint for EU1 region', () => {
  setUrl(`https://protect-euc1.cylance.com`)
  const expected = `https://eu1-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
  const result = resolveEnvironment()

  expect(result).toEqual(expected)
})

it('UES API endpoint for JP1 region', () => {
  setUrl(`https://protect-apne1.cylance.com`)
  const expected = `https://jp1-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
  const result = resolveEnvironment()

  expect(result).toEqual(expected)
})

it('UES API endpoint for AU1 region', () => {
  setUrl(`https://protect-au.cylance.com`)
  const expected = `https://au1-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
  const result = resolveEnvironment()

  expect(result).toEqual(expected)
})

it('UES API endpoint for BR1 region', () => {
  setUrl(`https://protect-sae1.cylance.com`)
  const expected = `https://br1-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
  const result = resolveEnvironment()

  expect(result).toEqual(expected)
})

it('UES API endpoint for GC1 region', () => {
  setUrl(`https://protect.us.cylance.com`)
  const expected = `https://gc1-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
  const result = resolveEnvironment()

  expect(result).toEqual(expected)
})

describe.each(['qa2', 'local-staging'])('Staging-uesApi', stagingEnv => {
  it(`UES API endpoint for staging enviroment ${stagingEnv}`, () => {
    setUrl(`https://${stagingEnv}-protect.cylance.com`)
    const expected = `https://qa2-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
    const result = resolveEnvironment()

    expect(result).toEqual(expected)
  })
})

describe.each(['r00', 'local-dev'])('Dev-uesApi', devEnv => {
  it(`UES API endpoint for dev environment ${devEnv}`, () => {
    setUrl(`https://${devEnv}-protect.cylance.com`)
    const expected = `https://r00-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
    const result = resolveEnvironment()

    expect(result).toEqual(expected)
  })
})

describe.each(['r01', 'r02', 'lt'])('Rxx-Dev-uesApi', devEnv => {
  it(`UES API endpoint for ${devEnv} environment`, () => {
    setUrl(`https://${devEnv}-protect.cylance.com`)
    const expected = `https://${devEnv}-uesapi.cylance.com/1db7e16b-a231-4495-be1a-90ef391f6ac8`
    const result = resolveEnvironment()

    expect(result).toEqual(expected)
  })
})
