import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import type { RenderOptions } from '@testing-library/react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'

import { PolicyData } from '@ues-data/dlp'

import IosSpecificSettings from './ios-specific-settings'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

const policyRules = [
  {
    activity: 'ACTIVITY_TYPE_SCREEN_CAPTURE',
    action: 'ACTION_TYPE_NONE',
    osType: 'OPERATING_SYSTEM_TYPE_IOS',
  },
  {
    activity: 'ACTIVITY_TYPE_BROWSER_UPLOAD',
    action: 'ACTION_TYPE_ALERT',
    osType: 'OPERATING_SYSTEM_TYPE_ALL',
  },
  {
    activity: 'ACTIVITY_TYPE_USB_EXFILTRATE',
    action: 'ACTION_TYPE_ALERT',
    osType: 'OPERATING_SYSTEM_TYPE_WINDOWS',
  },
]
const numberOfScreenshots = { OPERATING_SYSTEM_TYPE_IOS: 2 }
const intervalForScreenshots = { OPERATING_SYSTEM_TYPE_IOS: 2 }

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementationOnce(() => ({ policyRules, numberOfScreenshots, intervalForScreenshots })),
}))

jest.mock('@ues-data/dlp', () => ({
  PolicyData: {
    updateLocalPolicyData: jest.fn(),
    getLocalPolicyData: () => ({
      policyRules,
      numberOfScreenshots,
      intervalForScreenshots,
    }),
  },
}))

jest.mock('../usePoliciesPermission', () => ({
  usePoliciesPermissions: () => ({ canUpdate: true }),
}))

const store: any = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    'app.dlp.policies': {
      ui: {
        localPolicyData: {
          policyRules,
          numberOfScreenshots,
          intervalForScreenshots,
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
  const iosSpecificSettings = <IosSpecificSettings />
  const utils = customRender(iosSpecificSettings)
  const { getByRole, getAllByRole } = utils
  const intervalForScreenshots = utils.getByLabelText('intervalForScreenshots')

  return {
    getByRole,
    getAllByRole,
    intervalForScreenshots,
    ...utils,
  }
}

describe('Ios specific settings section', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('fire event onChange for intervalForScreenshots', () => {
    const { intervalForScreenshots } = setup()
    fireEvent.change(intervalForScreenshots, { target: { value: 4 } })
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({ intervalForScreenshots: { OPERATING_SYSTEM_TYPE_IOS: '4' } })
  })

  it('fire event onChange for numberOfScreenshots select', () => {
    const { getByRole, getAllByRole } = setup()
    // MUI select component uses the mouseDown event to trigger the popover menu to appear
    fireEvent.mouseDown(getAllByRole('button')[1])
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByLabelText('option-10'))
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({ numberOfScreenshots: { OPERATING_SYSTEM_TYPE_IOS: 10 } })
  })

  it.skip('fire event onChange for policyRules select', () => {
    // TEST runs separately but not in stack of execution of all tests
    // TODO from time to time returns incorrect expectd object in toHaveBeenCalledWith() func
    const { getByRole, getAllByRole } = setup()
    // MUI select component uses the mouseDown event to trigger the popover menu to appear
    fireEvent.mouseDown(getAllByRole('button')[0])
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByLabelText('action-type-alert'))
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({
      policyRules: [
        {
          activity: 'ACTIVITY_TYPE_SCREEN_CAPTURE',
          action: 'ACTION_TYPE_ALERT',
          osType: 'OPERATING_SYSTEM_TYPE_IOS',
        },
      ],
    })
  })

  it('renders correctly', () => {
    const iosSpecificSettings = <IosSpecificSettings />
    customRender(iosSpecificSettings)
  })
})
