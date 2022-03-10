export {}

const getUesEnv = () => {
  let uesModule
  jest.isolateModules(() => {
    uesModule = require('./ues')
  })
  return uesModule.UES_ENV
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
 * {env/region}-ues.cylance.com
 */

it('Test getUesEnv for US1 region', () => {
  setUrl(`https://protect.cylance.com`)
  const expected = 'PRODUCTION'
  const result = getUesEnv()

  expect(result).toEqual(expected)
})

describe.each(['euc1', 'apne1', 'au', 'sae1'])('Region-uesEnv', region => {
  it(`Test getUesEnv for region ${region}`, () => {
    setUrl(`https://protect-${region}.cylance.com`)
    const expected = 'PRODUCTION'
    const result = getUesEnv()

    expect(result).toEqual(expected)
  })
})

it('Test getUesEnv for GC1 region', () => {
  setUrl(`https://protect.us.cylance.com`)
  const expected = 'PRODUCTION'
  const result = getUesEnv()

  expect(result).toEqual(expected)
})

describe.each(['qa2', 'local-staging'])('Staging-uesEnv', stagingEnv => {
  it(`Test getUesEnv for staging environment ${stagingEnv}`, () => {
    setUrl(`https://${stagingEnv}-protect.cylance.com`)
    const expected = 'STAGING'
    const result = getUesEnv()

    expect(result).toEqual(expected)
  })
})

describe.each(['r00', 'r01', 'r02', 'local-dev'])('Dev-uesEnv', devEnv => {
  it(`Test getUesEnv for staging environment ${devEnv}`, () => {
    setUrl(`https://${devEnv}-protect.cylance.com`)
    const expected = 'DEV'
    const result = getUesEnv()

    expect(result).toEqual(expected)
  })
})
