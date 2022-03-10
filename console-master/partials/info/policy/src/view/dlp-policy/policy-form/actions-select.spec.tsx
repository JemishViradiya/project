import React from 'react'

import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'

import { ACTION_TYPE, ACTIVITY_TYPE, OPERATING_SYSTEM_TYPE } from '@ues-data/dlp'

import ActionsSelect from './actions-select'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}))

jest.mock('../usePoliciesPermission', () => ({
  usePoliciesPermissions: () => ({ canUpdate: true }),
}))

const onChange = jest.fn()
const policyRule = {
  activity: ACTIVITY_TYPE.ACTIVITY_TYPE_BROWSER_UPLOAD,
  action: ACTION_TYPE.ACTION_TYPE_ALERT,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_ALL,
}

describe('Action select component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const actionSelect = <ActionsSelect onChange={onChange} policyRule={policyRule} />
    render(actionSelect)
  })

  it('fires onChange event', () => {
    const actionSelect = <ActionsSelect onChange={onChange} policyRule={policyRule} />
    const { getByRole } = render(actionSelect)
    // MUI select component uses the mouseDown event to trigger the popover menu to appear
    fireEvent.mouseDown(getByRole('button'))
    const listbox = within(getByRole('listbox'))
    fireEvent.click(listbox.getByLabelText('action-type-none'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  // TODO to make renderHook work
  it.skip('setValue if event mouseDown fired', () => {
    const props = {
      onChange,
      policyRule,
    }
    const { result } = renderHook(() => ActionsSelect(props))
    expect(result.current.value).toBe(ACTION_TYPE.ACTION_TYPE_ALERT)

    act(() => {
      result.current.setValue(ACTION_TYPE.ACTION_TYPE_NONE)
    })

    expect(result.current.value).toBe(ACTION_TYPE.ACTION_TYPE_NONE)
  })
})
