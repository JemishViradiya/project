import { apiResolver, formatendpointDomain, getEnv, getGov, getRegion, isDefaultDomain } from './consoleapi'

const setUrl = domain => {
  const url = new URL(domain)

  Object.defineProperty(self, 'location', {
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
 * Must match to SPAs endpoint pattern
 * {env/region}-consoleapi.cylance.com
 */

describe.each(['protect', 'ues'])('apiResolver', domain => {
  it('default endpoint call to use US region when no env/region exists', () => {
    setUrl(`https://${domain}.cylance.com`)
    const expected = `https://consoleapi.cylance.com/`
    const result = apiResolver()

    expect(result).toEqual(expected)
  })

  it('use environment on endpoint when exists on domain', () => {
    setUrl(`https://qa2-${domain}.cylance.com`)
    const expected = `https://qa2-consoleapi.cylance.com/`
    const result = apiResolver()

    expect(result).toEqual(expected)
  })

  describe.each(['euc1', 'apne1', 'au', 'sae1'])('apiResolver', region => {
    it('use region on endpoint when exists on domain', () => {
      setUrl(`https://${domain}-${region}.cylance.com`)
      const expected = `https://${region}-consoleapi.cylance.com/`
      const result = apiResolver()

      expect(result).toEqual(expected)
    })
  })

  it('use gov on endpoint when exists on domain', () => {
    setUrl(`https://${domain}.us.cylance.com`)
    const expected = `https://us-consoleapi.cylance.com/`
    const result = apiResolver()

    expect(result).toEqual(expected)
  })

  describe('isDefaultDomain', () => {
    it('returns default region if default domain ', () => {
      setUrl(`https://${domain}.cylance.com`)
      const expected = `use1`
      const result = isDefaultDomain()

      expect(result).toEqual(expected)
    })

    it('returns null if not default domain', () => {
      setUrl(`https://${domain}.us.cylance.com`)
      const expected = null
      const result = isDefaultDomain()

      expect(result).toEqual(expected)
    })
  })

  describe('getEnv', () => {
    it('returns default region if default region exists', () => {
      const expected = `us`
      const result = getEnv('us')

      expect(result).toEqual(expected)
    })

    it('returns environment if exists', () => {
      setUrl(`https://qa2-${domain}.cylance.com`)
      const expected = `qa2`
      const result = getEnv(null)

      expect(result).toEqual(expected)
    })

    it('returns null if gov domain', () => {
      setUrl(`https://${domain}.us.cylance.com`)
      const expected = null
      const result = getEnv(null)

      expect(result).toEqual(expected)
    })

    describe.each(['euc1', 'apne1', 'au', 'sae1'])('apiResolver', region => {
      it('returns null if region domain', () => {
        setUrl(`https://${domain}-${region}.cylance.com`)
        const expected = null
        const result = getEnv(null)

        expect(result).toEqual(expected)
      })
    })
  })

  describe('getRegion', () => {
    it('returns env if exists', () => {
      const expected = `us`
      const result = getRegion('us')

      expect(result).toEqual(expected)
    })

    it('returns region if in parameter', () => {
      setUrl(`https://${domain}-euc1.cylance.com`)
      const expected = `euc1`
      const result = getRegion(null)

      expect(result).toEqual(expected)
    })

    it('returns region if exists', () => {
      setUrl(`https://${domain}-euc1.cylance.com`)
      const expected = `euc1`
      const result = getRegion(null)

      expect(result).toEqual(expected)
    })

    it('returns null if gov domain', () => {
      setUrl(`https://${domain}.us.cylance.com`)
      const expected = null
      const result = getRegion(null)

      expect(result).toEqual(expected)
    })

    it('returns swap if exists - euc1', () => {
      setUrl(`https://${domain}-swap-euc1.cylance.com`)
      const expected = `swap-euc1`
      const result = getRegion(null)

      expect(result).toEqual(expected)
    })

    it('returns swap if exists - us', () => {
      setUrl('https://login-swap.cylance.com/')
      const expected = `swap`
      const result = getRegion(null)

      expect(result).toEqual(expected)
    })

    it('returns "protect" for protect', () => {
      setUrl('https://protect.cylance.com/')
      const expected = `protect`
      const result = getRegion(null)

      expect(result).toEqual(expected)
    })
  })

  describe('getGov', () => {
    it('returns env or region if passed as parameter', () => {
      const expected = `us`
      const result = getGov('us')

      expect(result).toEqual(expected)
    })

    it('returns gov if exists', () => {
      setUrl(`https://${domain}.us.cylance.com`)
      const expected = `us`
      const result = getGov(null)

      expect(result).toEqual(expected)
    })

    it('returns null if region exists', () => {
      setUrl(`https://${domain}-euc1.cylance.com`)
      const expected = null
      const result = getGov(null)

      expect(result).toEqual(expected)
    })

    it('returns null if environment domain', () => {
      setUrl(`https://qa2-${domain}.cylance.com`)
      const expected = null
      const result = getGov(null)

      expect(result).toEqual(expected)
    })
  })

  describe('formatendpointDomain', () => {
    it('returns formatted endpoint api if envOrRegionOrGov passed as parameter', () => {
      const expected = `https://euc1-consoleapi.cylance.com/`
      const result = formatendpointDomain('euc1')

      expect(result).toEqual(expected)
    })

    it('returns formatted endpoint api if swap included with envOrRegion', () => {
      const expected = `https://euc1-swap-consoleapi.cylance.com/`
      const result = formatendpointDomain('euc1-swap')

      expect(result).toEqual(expected)
    })

    it('returns default us endpoint domain if no parameter exists', () => {
      setUrl(`https://qa2-${domain}.cylance.com`)
      const expected = `https://consoleapi.cylance.com/`
      const result = formatendpointDomain(null)

      expect(result).toEqual(expected)
    })
  })
})
