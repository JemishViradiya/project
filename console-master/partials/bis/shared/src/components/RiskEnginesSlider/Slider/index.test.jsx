/* eslint-disable sonarjs/no-duplicate-string */

import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { act } from 'react-dom/test-utils'

import { cleanup, fireEvent, render } from '@testing-library/react'

import { RiskLevelTypes } from '@ues-data/bis/model'

import { useStandalone as isStandalone } from '../../../hooks'
import Slider from './Slider'

jest.mock('@material-ui/core/Hidden', () => ({ children }) => children)
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useStandalone: jest.fn(() => false),
}))

// mock styles to make sure different themes won't change slider's behavior
// (except of rail color but palette's chipAlers is used only in UES mode)
jest.mock('@material-ui/core/styles', () => ({
  ...jest.requireActual('@material-ui/core/styles'),
  useTheme: () => ({
    palette: {
      chipAlert: {
        critical: '#FF00FF',
      },
      grey: {},
    },
  }),
}))

const value = {
  min: 66,
  max: 100,
}

const changeSliderValue = async (slider, value) => {
  await act(async () => {
    fireEvent.mouseDown(slider, {
      clientX: value,
    })
  })
}

const changeInputValue = async (input, value) => {
  await act(async () => {
    fireEvent.input(input, {
      target: { value },
    })
  })
}

const overrideSliderBoudingRect = slider =>
  (slider.getBoundingClientRect = () => ({
    width: 100,
    left: 0,
  }))
const getMockedHandleSlider = expectedResult => (e, newValue) => expect(newValue).toEqual(expectedResult)
const getMockedInputSlider = expectedResult => e => expect(e.target.value).toEqual(expectedResult)

const createSut = (value, onChange, disabled) =>
  render(
    <Slider
      value={value}
      handleSliderChange={onChange}
      riskLevel={RiskLevelTypes.CRITICAL}
      handleSliderInputChange={onChange}
      disabled={disabled}
    />,
  )

describe('BehaviorRiskSlider', () => {
  afterEach(cleanup)

  const onChange = jest.fn()

  it('renders correctly', async () => {
    const { getByText, queryAllByRole, queryByTestId } = createSut(value, onChange)

    // thumbs
    const thumbs = queryAllByRole('slider')
    expect(thumbs).toHaveLength(1)
    expect(thumbs[0]).toHaveStyle('left: 65.65656565656566%;')

    //  marks
    expect(getByText('100 %')).toBeVisible()

    expect(queryByTestId('risk-engines-input')).toHaveValue(66)
  })

  it('renders UES rail color correctly', async () => {
    isStandalone.mockReturnValueOnce(false)
    const { container } = createSut(value, onChange)
    expect(container.querySelector('.MuiSlider-rail')).toHaveStyle('color: #FF00FF')
  })

  it('dont render slider when disabled', async () => {
    const { container } = createSut(value, onChange, true)
    const slider = container.querySelector('.MuiSlider-root')

    expect(slider).toBeNull()
  })

  it('works correctly for less values', async () => {
    const value = {
      min: 80,
      max: 100,
    }
    const expectedResult = 66
    const { container, queryAllByRole } = createSut(value, getMockedHandleSlider(expectedResult))

    const slider = container.querySelector('.MuiSlider-root')
    overrideSliderBoudingRect(slider)

    await changeSliderValue(slider, 66)
    expect(queryAllByRole('slider')).toHaveLength(1)
  })

  it('calls onchange callback', async () => {
    const expectedResult = 13
    const { container } = createSut(value, getMockedHandleSlider(expectedResult))

    const slider = container.querySelector('.MuiSlider-root')
    overrideSliderBoudingRect(slider)

    await changeSliderValue(slider, 12)
  })

  it('renders correctly when getting value twice', async () => {
    const expectedResult = 55
    const { rerender, queryByTestId } = createSut(value, getMockedHandleSlider(expectedResult))

    const newValue = {
      min: 55,
      max: 100,
    }

    rerender(<Slider value={newValue} />)

    expect(queryByTestId('risk-engines-input')).toHaveValue(55)
  })

  it.each`
    value   | expectedValue
    ${-1}   | ${'-1'}
    ${0}    | ${'0'}
    ${1}    | ${'1'}
    ${2}    | ${'2'}
    ${2.2}  | ${'2.2'}
    ${50}   | ${'50'}
    ${55.5} | ${'55.5'}
    ${99}   | ${'99'}
    ${100}  | ${'100'}
    ${101}  | ${'101'}
  `('should be called correctly', async ({ value, expectedValue }) => {
    const sliderValue = {
      min: 55,
      max: 100,
    }

    const { queryByTestId } = createSut(sliderValue, getMockedInputSlider(expectedValue))

    await changeInputValue(queryByTestId('risk-engines-input'), value)
  })
})
