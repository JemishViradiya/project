export {}

const getEidUrl = () => {
  let eidModule
  jest.isolateModules(() => {
    eidModule = require('./eid')
  })
  return eidModule.EID_URL
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
 * Possible UES domain patterns
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
 */

it('Test getEidUrl for US1 region', () => {
  setUrl(`https://protect.cylance.com`)
  const expected = 'https://idp.blackberry.com'
  const result = getEidUrl()

  expect(result).toEqual(expected)
})

describe.each(['euc1', 'apne1', 'au', 'sae1'])('Region-eidUrl', region => {
  it(`Test getEidUrl for ${region} region`, () => {
    setUrl(`https://protect-${region}.cylance.com`)
    const expected = 'https://idp.blackberry.com'
    const result = getEidUrl()

    expect(result).toEqual(expected)
  })
})

it('Test getEidUrl for GC1 region', () => {
  setUrl(`https://protect.us.cylance.com`)
  const expected = 'https://idp.blackberry.com'
  const result = getEidUrl()

  expect(result).toEqual(expected)
})

describe.each(['qa2', 'local-staging'])('Staging-eidUrl', stagingEnv => {
  it(`Test getEidUrl for staging environment '${stagingEnv}'`, () => {
    setUrl(`https://${stagingEnv}-protect.cylance.com`)
    const expected = 'https://idp-rel.eval.blackberry.com'
    const result = getEidUrl()

    expect(result).toEqual(expected)
  })
})

describe.each(['r00', 'r01', 'r02', 'local-dev'])('Dev-eidUrl', devEnv => {
  it(`Test getEidUrl for dev environment '${devEnv}'`, () => {
    setUrl(`https://${devEnv}-protect.cylance.com`)
    const expected = 'https://idp-dev.eval.blackberry.com'
    const result = getEidUrl()

    expect(result).toEqual(expected)
  })
})
