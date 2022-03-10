import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render, within } from '@testing-library/react'

import { getSelectOptions } from '../../../../tests/utils'
import { RiskLevel } from '../../../shared'
import RiskReductionModal from './RiskReductionModal'

describe('RiskReductionModal', () => {
  afterEach(() => {
    cleanup()
  })

  const SELECT_TEST_ID = 'risk-reduction-modal-select'

  it('render with default properties - HIGH', async () => {
    const showModal = true
    const { queryAllByText, getByTestId } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="HIGH"
        onClose={() => {}}
        onApply={() => {}}
        riskLevels={[RiskLevel.HIGH, RiskLevel.LOW]}
      />,
    )

    expect(queryAllByText(/Automatic risk reduction/)).not.toHaveLength(0)
    expect(getByTestId(SELECT_TEST_ID).value).toBe('HIGH')
    const options = await getSelectOptions(getByTestId(SELECT_TEST_ID))
    expect(within(options).queryByText('High risk')).toBeTruthy()
    expect(within(options).queryByText('Medium risk and above')).toBeFalsy()
    expect(within(options).queryByText('None')).toBeTruthy()
  })

  it('render with default properties - CRITICAL', async () => {
    const showModal = true
    const { getByTestId } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="CRITICAL"
        onClose={() => {}}
        onApply={() => {}}
        riskLevels={[RiskLevel.CRITICAL, RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW]}
      />,
    )

    expect(getByTestId(SELECT_TEST_ID).value).toBe('CRITICAL')
    const options = await getSelectOptions(getByTestId(SELECT_TEST_ID))
    expect(within(options).queryByText('Critical risk')).toBeTruthy()
    expect(within(options).queryByText('High risk')).toBeTruthy()
    expect(within(options).queryByText('Medium risk and above')).toBeTruthy()
    expect(within(options).queryByText('None')).toBeTruthy()
  })

  it('render with default properties - MEDIUM', async () => {
    const showModal = true
    const { getByTestId } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="MEDIUM"
        onClose={() => {}}
        onApply={() => {}}
        riskLevels={[RiskLevel.MEDIUM]}
      />,
    )

    expect(getByTestId(SELECT_TEST_ID).value).toBe('MEDIUM')
    const options = await getSelectOptions(getByTestId(SELECT_TEST_ID))
    expect(within(options).queryByText('Critical risk')).toBeFalsy()
    expect(within(options).queryByText('High risk')).toBeFalsy()
    expect(within(options).queryByText('Medium risk and above')).toBeTruthy()
    expect(within(options).queryByText('None')).toBeTruthy()
  })

  it('do not render modal', () => {
    const showModal = false
    const { queryAllByText, queryByTestId } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="HIGH"
        onClose={() => {}}
        onApply={() => {}}
        riskLevels={[RiskLevel.HIGH]}
      />,
    )
    expect(queryAllByText(/Automatic risk reduction/)).toHaveLength(0)
    expect(queryByTestId('Select')).toBeNull()
  })

  it('render with default value changes', () => {
    const showModal = true
    const { rerender, getByTestId } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="NONE"
        onClose={() => {}}
        onApply={() => {}}
        riskLevels={[RiskLevel.MEDIUM, RiskLevel.HIGH]}
      />,
    )
    const select = getByTestId(SELECT_TEST_ID)
    expect(select.value).toBe('NONE')

    // Re-render with new default value
    rerender(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="MEDIUM"
        onClose={() => {}}
        onApply={() => {}}
        riskLevels={[RiskLevel.MEDIUM, RiskLevel.HIGH]}
      />,
    )

    expect(select.value).toBe('MEDIUM')
  })

  it('test select and apply a different value', () => {
    const onApply = jest.fn()
    const onClose = jest.fn()
    const showModal = true
    const { getByText, getByTestId } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="MEDIUM"
        onClose={onClose}
        onApply={onApply}
        riskLevels={[RiskLevel.HIGH, RiskLevel.MEDIUM]}
      />,
    )
    const select = getByTestId(SELECT_TEST_ID)

    // Select HIGH
    act(() => {
      fireEvent.change(select, { target: { value: 'HIGH' } })
    })
    expect(select.value).toBe('HIGH')

    // Apply selected value
    const apply = getByText(/Apply/)
    act(() => {
      fireEvent.click(apply)
    })
    expect(onApply).toHaveBeenCalledWith('HIGH')
  })

  it('test close modal', () => {
    const onApply = jest.fn()
    const onClose = jest.fn()
    const showModal = true
    const { getByText } = render(
      <RiskReductionModal
        {...(showModal && { dialogId: 'test-dialog-id' })}
        value="HIGH"
        onClose={onClose}
        onApply={onApply}
        riskLevels={[RiskLevel.HIGH]}
      />,
    )

    // Close modal
    act(() => {
      fireEvent.click(getByText(/Cancel/))
    })
    expect(onClose).toHaveBeenCalled()
  })
})
