import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import type { RenderOptions } from '@testing-library/react'
import { cleanup, fireEvent, queries, render, screen, within } from '@testing-library/react'

import { PolicyData } from '@ues-data/dlp'

import EmailSettings from './email-settings'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
  Trans: () => 'Emails info with link', // TODO need to check how improve it
}))

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  usePermissions: () => ({ hasPermission: jest.fn().mockReturnValue(true) }),
}))

const defaultEmailsDomainRule = {
  emailDomainsRule: 'NONE',
}

jest.mock('../usePoliciesPermission', () => ({
  usePoliciesPermissions: () => ({ canUpdate: true }),
}))

jest.mock('@ues-data/dlp', () => ({
  PolicyData: {
    updateLocalPolicyData: jest.fn(),
    getLocalPolicyData: () => defaultEmailsDomainRule,
  },
}))

const store: any = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    'app.dlp.policies': {
      ui: {
        localPolicyData: {},
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
  const emailSettings = <EmailSettings />
  const utils = customRender(emailSettings)
  const { getByRole } = utils

  return {
    getByRole,
    ...utils,
  }
}

describe('Email settings section', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const emailSettings = <EmailSettings />
    customRender(emailSettings)
  })

  it('fire event onChange for email domain', () => {
    const { getByRole } = setup()
    // MUI select component uses the mouseDown event to trigger the popover menu to appear
    fireEvent.mouseDown(getByRole('button'))
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByLabelText('email-domain-internal'))
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({ emailDomainsRule: 'INTERNAL_RECIPIENTS_ONLY' })
  })
})
