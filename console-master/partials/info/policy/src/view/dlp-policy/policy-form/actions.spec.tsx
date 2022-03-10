import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import type { RenderOptions } from '@testing-library/react'
import { cleanup, fireEvent, render, within } from '@testing-library/react'

import { PolicyData } from '@ues-data/dlp'

import Actions from './actions'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

jest.mock('../usePoliciesPermission', () => ({
  usePoliciesPermissions: () => ({ canUpdate: true }),
}))

const policyRule = {
  action: 'ACTION_TYPE_ALERT',
  activity: 'ACTIVITY_TYPE_BROWSER_UPLOAD',
  osType: 'OPERATING_SYSTEM_TYPE_ALL',
}

const unSupportedPolicyRule = {
  activity: 'ACTIVITY_TYPE_SCREEN_CAPTURE',
  action: 'ACTION_TYPE_NONE',
  osType: 'OPERATING_SYSTEM_TYPE_IOS',
}

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest
    .fn()
    .mockImplementationOnce(() => [policyRule, unSupportedPolicyRule])
    .mockImplementationOnce(() => [policyRule]),
}))

jest.mock('@ues-data/dlp', () => ({
  PolicyData: {
    getSupportedPolicyRules: jest.fn().mockReturnValue([
      {
        action: 'ACTION_TYPE_ALERT',
        activity: 'ACTIVITY_TYPE_BROWSER_UPLOAD',
        osType: 'OPERATING_SYSTEM_TYPE_ALL',
      },
    ]),
    updateLocalPolicyData: jest.fn(),
    getLocalPolicyData: () => ({ policyRules: [policyRule, unSupportedPolicyRule] }),
  },
}))

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  usePermissions: () => ({ hasPermission: jest.fn().mockReturnValue(true) }),
}))

const store: any = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    'app.dlp.policies': {
      ui: {
        localPolicyData: {
          policyRules: [policyRule, unSupportedPolicyRule],
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

  it('fire event onChange for policy rule', () => {
    const actions = <Actions />
    const { getByRole } = customRender(actions)
    // MUI select component uses the mouseDown event to trigger the popover menu to appear
    fireEvent.mouseDown(getByRole('button'))
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByLabelText('action-type-none'))
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({
      policyRules: [{ ...policyRule, action: 'ACTION_TYPE_NONE' }, unSupportedPolicyRule],
    })
  })

  it('renders correctly', () => {
    const actions = <Actions />
    customRender(actions)
  })
})
