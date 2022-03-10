import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import type { RenderOptions } from '@testing-library/react'
import { cleanup, fireEvent, render, within } from '@testing-library/react'

import { Domain, PolicyData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import WhitelistDomains from './whitelist-domains'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

const domainElements = [
  {
    certThumbprint: '',
    created: '2021-06-25T09:32:59.441967Z',
    description: '',
    domain: 'test.com',
    enabled: 'true',
    guid: '12345',
  },
  {
    certThumbprint: '',
    created: '2021-06-30T12:51:36.361895Z',
    description: 'wikis.rim.net',
    domain: 'wikis.rim.net',
    enabled: 'true',
    guid: '67890',
  },
]

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementationOnce(() => []),
}))

jest.mock('@ues-data/dlp', () => ({
  PolicyData: {
    getBrowserDomains: jest.fn().mockReturnValue([]),
    updateLocalPolicyData: jest.fn(),
    getLocalPolicyData: () => ({ browserDomains: [] }),
  },
  Domain: {
    queryBrowserDomains: jest.fn(() =>
      Promise.resolve({ data: { count: 2, elements: domainElements, totals: { pages: 1, elements: 2 } }, loading: false }),
    ),
  },
}))

const store: any = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    'app.dlp.policies': {
      ui: {
        localPolicyData: {
          browserDomains: [],
        },
      },
    },
  })),
}

const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

describe('Actions section', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it.skip('renders correctly', () => {
    //TODO useStatefulReduxQuery throws error: [TypeError: selector is not a function]
    const whitelistDomains = <WhitelistDomains />
    customRender(whitelistDomains)
  })
})
