import React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'

import RiskFactors from './RiskFactors'

const defaultProps = {
  onChange: () => {},
}

const createSut = props => {
  return render(<RiskFactors {...defaultProps} {...props} />)
}

describe('RiskFactors', () => {
  afterEach(cleanup)

  it('should not render risk factors switches when list is empty', () => {
    const riskFactors = []

    const sut = createSut({ riskFactors })

    const switches = sut.queryByRole('checkbox')
    expect(switches).toBeFalsy()
  })

  it('should render risk factors switches', () => {
    const riskFactors = [
      { id: 'ID_1', title: 'TITLE_1' },
      { id: 'ID_2', title: 'TITLE_2' },
      { id: 'ID_3', title: 'TITLE_3' },
    ]

    const sut = createSut({ riskFactors })

    const switches = sut.getAllByRole('checkbox')
    expect(switches.length).toBe(3)
  })

  it('should render risk factors switch enabled', () => {
    const riskFactors = [{ id: 'ID_1', title: 'TITLE_1' }]

    const sut = createSut({ riskFactors })

    const switchElement = sut.getByRole('checkbox')
    expect(switchElement.disabled).toBe(false)
  })

  it('should render risk factors switch disabled', () => {
    const riskFactors = [{ id: 'ID_1', title: 'TITLE_1' }]
    const canEdit = false

    const sut = createSut({ riskFactors, canEdit })

    const switchElement = sut.getByRole('checkbox')
    expect(switchElement.disabled).toBe(true)
  })

  it('should handle change function when switch is clicked', () => {
    const riskFactors = [{ id: 'ID_1', title: 'TITLE_1' }]
    const onChangeMock = jest.fn()
    const sut = createSut({ riskFactors, onChange: onChangeMock })
    const switchElement = sut.getByRole('checkbox')

    fireEvent.click(switchElement)

    expect(onChangeMock).toHaveBeenCalledWith([{ checked: true, id: 'ID_1', title: 'TITLE_1' }])
  })
})
