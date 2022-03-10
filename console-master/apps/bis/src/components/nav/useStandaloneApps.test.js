import '@testing-library/jest-dom/extend-expect'

import useClientParams from '../hooks/useClientParams'
import useTenant from '../hooks/useTenant'
import { useStandaloneApps } from './useStandaloneApps'

jest.mock('./getRoutes', () => ({
  getRoutes: jest.fn(() => {
    return {
      publicPath: '/',
      userNavigation: {
        flavours: [
          { name: 'strawberry', type: 'icecream' },
          { name: 'vanilla', type: 'icecream' },
        ],
      },
      navigation: [],
      settingsNavigation: {
        name: 'over',
        route: '/here',
        navigation: [],
      },
      IpAddressRisk: {
        name: 'IP addresses',
        route: '/ip-addresses',
      },
    }
  }),
}))

jest.mock('../hooks/useTenant')

useTenant.mockReturnValue({ tenant: 'test' })

jest.mock('../hooks/useClientParams')

useClientParams.mockReturnValue({ features: { IpAddressRisk: false } })

describe('useStandaloneApps', () => {
  test('properly pushes settingsNavigation onto navigation', () => {
    expect(useStandaloneApps()).toMatchObject({
      userNavigation: {
        flavours: [
          { name: 'strawberry', type: 'icecream' },
          { name: 'vanilla', type: 'icecream' },
        ],
      },
      navigation: [
        {
          name: 'over',
          route: '/here',
          navigation: [],
        },
      ],
    })
  })
  test('IpAddressRisk enabled', () => {
    useClientParams.mockReturnValue({ features: { IpAddressRisk: true } })
    expect(useStandaloneApps()).toMatchObject({
      userNavigation: {
        flavours: [
          { name: 'strawberry', type: 'icecream' },
          { name: 'vanilla', type: 'icecream' },
        ],
      },
      navigation: [
        {
          name: 'over',
          route: '/here',
          navigation: [{ name: 'IP addresses', route: '/ip-addresses' }],
        },
      ],
    })
  })
})
