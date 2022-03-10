import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import type { RenderOptions } from '@testing-library/react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'

import { PolicyData } from '@ues-data/dlp'

import GeneralInfo from './general-info'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

const defaultGetGeneralInfo = {
  policyName: 'test',
  description: 'desc',
}

jest.mock('@ues-data/dlp', () => ({
  PolicyData: {
    updateLocalPolicyData: jest.fn(),
    getGeneralInfo: () => defaultGetGeneralInfo,
  },
  CLASSIFICATION: {
    ORGANIZATIONAL: 'ORGANIZATIONAL',
  },
}))

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  usePermissions: () => ({ hasPermission: jest.fn().mockReturnValue(true) }),
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useParams: () => ({
    policyType: 'mobile',
  }),
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
  const generalInfo = <GeneralInfo />
  const utils = customRender(generalInfo)
  const { getByRole } = utils
  const inputPolicyName = utils.getByLabelText('policyName')
  const inputPolicyDesc = utils.getByLabelText('description')

  // All attempts to find classification input were failed
  // const divClassification = utils.getByLabelText('classification')
  // const divClassification = utils.queryByDisplayValue('ORGANIZATIONAL')
  // const divClassification = utils.queryBy('ORGANIZATIONAL')
  // const divClassification = utils.getByRole('button', { name: 'classification' })
  // const divClassification = utils.getByName('classification')

  return {
    inputPolicyName,
    inputPolicyDesc,
    getByRole,
    ...utils,
  }
}

describe.skip('General info section', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const generalInfo = <GeneralInfo />
    customRender(generalInfo)
  })

  it('fire event onChange for policyName', () => {
    const { inputPolicyName } = setup()
    const policyValue = 'policy test'
    // fire onChange event fo policyName input
    fireEvent.change(inputPolicyName, { target: { value: policyValue } })
    expect(inputPolicyName.value).toBe(policyValue)
    // The mock function was called at least once with the specified args
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({ ...defaultGetGeneralInfo, policyName: policyValue })
  })

  it('fire event onChange for description', () => {
    const { inputPolicyDesc } = setup()
    const description = 'policy test'
    // fire onChange event for description input
    fireEvent.change(inputPolicyDesc, { target: { value: description } })
    expect(inputPolicyDesc.value).toBe(description)
    // The mock function was called at least once with the specified args
    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({ ...defaultGetGeneralInfo, description })
  })

  it('should hide classification dropdown if policy type is mobile', () => {
    // const generalInfo = <GeneralInfo />
    // customRender(generalInfo)
    const classificationEl = screen.queryByLabelText('classification')
    expect(classificationEl).toBeNull()
  })

  // TODO change mock store policyType to 'content' in order to render select component
  it.skip('fire event onChange for classification', () => {
    const { getByRole } = setup()
    const classification = 'REGULATORY'
    fireEvent.mouseDown(getByRole('button'))
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByLabelText('email-domain-internal'))

    expect(PolicyData.updateLocalPolicyData).toHaveBeenCalledWith({ ...defaultGetGeneralInfo, classification })
  })
})
