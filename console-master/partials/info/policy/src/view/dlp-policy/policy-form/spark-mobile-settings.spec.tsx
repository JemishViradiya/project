import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import type { RenderOptions } from '@testing-library/react'
import { cleanup, fireEvent, render, within } from '@testing-library/react'

import { PolicyData } from '@ues-data/dlp'

import SparkMobileSettings from './spark-mobile-settings'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  usePermissions: () => ({ hasPermission: jest.fn().mockReturnValue(true) }),
}))

const policyConfigs = [
  {
    config: 'CONFIG_TYPE_ALLOW_COPY_BB_APPS_INTO_NON_BB_APPS',
    osType: 'OPERATING_SYSTEM_TYPE_IOS',
    enabled: false,
  },
  {
    config: 'CONFIG_TYPE_ALLOW_COPY_BB_APPS_INTO_NON_BB_APPS',
    osType: 'OPERATING_SYSTEM_TYPE_ANDROID_GENERIC',
    enabled: false,
  },
  {
    config: 'CONFIG_TYPE_ALLOW_COPY_NON_BB_APPS_INTO_BB_APPS',
    osType: 'OPERATING_SYSTEM_TYPE_IOS',
    enabled: false,
  },
  {
    config: 'CONFIG_TYPE_ALLOW_COPY_NON_BB_APPS_INTO_BB_APPS',
    osType: 'OPERATING_SYSTEM_TYPE_ANDROID_GENERIC',
    enabled: false,
  },
]

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementationOnce(() => ({ policyConfigs: policyConfigs })),
}))

jest.mock('@ues-data/dlp', () => ({
  PolicyData: {
    updateLocalPolicyData: jest.fn(),
    getLocalPolicyData: () => ({
      policyConfigs: policyConfigs,
    }),
  },
  MOBILE_OPERATING_SYSTEM_TYPE_NAMES: {
    OPERATING_SYSTEM_TYPE_ANDROID_GENERIC: 'Android',
    OPERATING_SYSTEM_TYPE_IOS: 'IOS',
  },
}))

const store: any = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    'app.dlp.policies': {
      ui: {
        localPolicyData: {
          policyConfigs,
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

// To detect DOM events need to find HTML elements on page by aria-label attr
const setup = () => {
  const sparkMobileSettings = <SparkMobileSettings />
  const utils = customRender(sparkMobileSettings)
  const { getByRole } = utils
  const switcher = utils.getByLabelText('CONFIG_TYPE_ALLOW_COPY_BB_APPS_INTO_NON_BB_APPS')

  return {
    getByRole,
    switcher,
    ...utils,
  }
}

describe('Spark mobile settings section', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('fire event onChange for checkbox', () => {
    const { switcher } = setup()
    // MUI select component uses the mouseDown event to trigger the popover menu to appear
    fireEvent.click(within(switcher).getByRole('checkbox'))
    fireEvent.change(within(switcher).getByRole('checkbox'), { target: { checked: true } })
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalled() // TODO investigate why toHaveBeenCalledWith is not working
  })

  it('renders correctly', () => {
    const sparkMobileSettings = <SparkMobileSettings />
    customRender(sparkMobileSettings)
  })
})
