import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'

import ClusterPopup from './ClusterPopup'

describe('ClusterPopup', () => {
  afterEach(() => {
    cleanup()
  })

  it('is empty without summary values', () => {
    const props = {
      summary: {},
      onClickFunctions: {},
    }
    const { queryByTestId, getByTestId } = render(<ClusterPopup {...props} />)
    getByTestId('SummaryPopup')

    expect(queryByTestId('PopUpCritical')).toBeNull()
    expect(queryByTestId('PopUpHigh')).toBeNull()
    expect(queryByTestId('PopUpMedium')).toBeNull()
    expect(queryByTestId('PopUpLow')).toBeNull()
    expect(queryByTestId('PopUpUnknown')).toBeNull()
    expect(queryByTestId('PopUpTotal')).toBeNull()
  })

  it('is has no "unknown" without a total', () => {
    const props = {
      summary: { critical: 11, high: 22, medium: 33, low: 44 },
      onClickFunctions: {},
    }
    const { queryByTestId, getByTestId } = render(<ClusterPopup {...props} />)
    getByTestId('SummaryPopup')

    getByTestId('PopUpCritical')
    getByTestId('PopUpHigh')
    getByTestId('PopUpMedium')
    getByTestId('PopUpLow')
    expect(queryByTestId('PopUpUnknown')).toBeNull()
    expect(queryByTestId('PopUpTotal')).toBeNull()
  })

  test('you can click all the buttons', () => {
    const props = {
      summary: { critical: 11, high: 22, medium: 33, low: 44, total: 100 },
      onClickFunctions: {
        gotoTotal: jest.fn(),
        gotoUnknown: jest.fn(),
        gotoCritical: jest.fn(),
        gotoHigh: jest.fn(),
        gotoMedium: jest.fn(),
        gotoLow: jest.fn(),
      },
    }
    const { getByTestId } = render(<ClusterPopup {...props} />)
    getByTestId('SummaryPopup')

    const critical = getByTestId('PopUpCritical')
    const high = getByTestId('PopUpHigh')
    const medium = getByTestId('PopUpMedium')
    const low = getByTestId('PopUpLow')
    const unknown = getByTestId('PopUpUnknown')
    const total = getByTestId('PopUpTotal')

    // displayed values should be right
    const s = props.summary
    const unknownCount = s.total - s.critical - s.high - s.medium - s.low

    // each entry displays the correct text for that entry
    expect(critical.querySelector('span.label').textContent).toEqual(expect.stringContaining(s.critical.toString()))
    expect(high.querySelector('span.label').textContent).toEqual(expect.stringContaining(s.high.toString()))
    expect(medium.querySelector('span.label').textContent).toEqual(expect.stringContaining(s.medium.toString()))
    expect(low.querySelector('span.label').textContent).toEqual(expect.stringContaining(s.low.toString()))
    expect(total.querySelector('span.label').textContent).toEqual(expect.stringContaining(s.total.toString()))
    expect(unknown.querySelector('span.label').textContent).toEqual(expect.stringContaining(unknownCount.toString()))

    // treating each as a "button" should work
    fireEvent.click(critical)
    expect(props.onClickFunctions.gotoCritical).toHaveBeenCalled()
    fireEvent.click(high)
    expect(props.onClickFunctions.gotoHigh).toHaveBeenCalled()
    fireEvent.click(medium)
    expect(props.onClickFunctions.gotoMedium).toHaveBeenCalled()
    fireEvent.click(low)
    expect(props.onClickFunctions.gotoLow).toHaveBeenCalled()
    fireEvent.click(total)
    expect(props.onClickFunctions.gotoTotal).toHaveBeenCalled()
    fireEvent.click(unknown)
    expect(props.onClickFunctions.gotoUnknown).toHaveBeenCalled()

    // ... and have been called just once
    expect(props.onClickFunctions.gotoCritical).toHaveBeenCalledTimes(1)
    expect(props.onClickFunctions.gotoHigh).toHaveBeenCalledTimes(1)
    expect(props.onClickFunctions.gotoMedium).toHaveBeenCalledTimes(1)
    expect(props.onClickFunctions.gotoLow).toHaveBeenCalledTimes(1)
    expect(props.onClickFunctions.gotoTotal).toHaveBeenCalledTimes(1)
    expect(props.onClickFunctions.gotoUnknown).toHaveBeenCalledTimes(1)
  })
})
