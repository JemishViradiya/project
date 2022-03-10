import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import ColumnOptions from './ColumnOptions'

const defaultProps = {
  headers: {
    abc: {
      dataKey: 'abc',
      columnName: 'abc',
      visible: true,
      disabled: false,
    },
    bcd: {
      dataKey: 'bcd',
      columnName: 'bcd',
      visible: true,
      disabled: false,
    },
    unchecked: {
      dataKey: 'unchecked',
      columnName: 'unchecked',
      visible: false,
      disabled: false,
    },
  },
  onMenuCheckbox: jest.fn(),
}

describe('ColumnOptions widget', () => {
  afterEach(() => {
    cleanup()
  })

  it('one section', () => {
    const props = {
      ...defaultProps,
    }
    const { getByLabelText, getByText, container } = render(<ColumnOptions {...props} />)
    const abcCheckbox = getByLabelText('abc')
    const bcdCheckbox = getByLabelText('bcd')
    const uncheckedCheckbox = getByLabelText('unchecked')
    expect(container.querySelectorAll('.oneSection')).toHaveLength(1)
    expect(getByText('All')).toBeVisible()
    expect(abcCheckbox.checked).toBe(true)
    expect(bcdCheckbox.checked).toBe(true)
    expect(uncheckedCheckbox.checked).toBe(false)

    act(() => {
      fireEvent.click(abcCheckbox, 'first')
      fireEvent.click(uncheckedCheckbox, 'second')
    })

    expect(props.onMenuCheckbox).toBeCalledTimes(2)
    expect(props.onMenuCheckbox).toBeCalledWith(expect.any(Object), props.headers.abc)
    expect(props.onMenuCheckbox).toBeCalledWith(expect.any(Object), props.headers.unchecked)
  })

  it('multiple sections', () => {
    const props = {
      ...defaultProps,
      headers: {
        ...defaultProps.headers,
        other: {
          dataKey: 'other',
          columnName: 'other',
          visible: false,
          disabled: false,
          section: 'Other',
        },
      },
    }
    const { getByLabelText, getByText, container } = render(<ColumnOptions {...props} />)
    const otherCheckbox = getByLabelText('other')
    const uncheckedCheckbox = getByLabelText('unchecked')
    expect(container.querySelectorAll('.oneSection')).toHaveLength(0)
    expect(container.querySelectorAll('.allSections')).toHaveLength(1)
    expect(container.querySelectorAll('.section')).toHaveLength(2)
    expect(getByText('All')).toBeVisible()
    expect(getByText('Other')).toBeVisible()
    expect(otherCheckbox.checked).toBe(false)
    expect(uncheckedCheckbox.checked).toBe(false)

    act(() => {
      fireEvent.click(otherCheckbox, 'first')
      fireEvent.click(uncheckedCheckbox, 'second')
    })

    expect(props.onMenuCheckbox).toBeCalledTimes(2)
    expect(props.onMenuCheckbox).toBeCalledWith(expect.any(Object), props.headers.other)
    expect(props.onMenuCheckbox).toBeCalledWith(expect.any(Object), props.headers.unchecked)
  })

  it('multiple sections with no All', () => {
    const props = {
      ...defaultProps,
      headers: {
        one: {
          dataKey: 'one',
          columnName: 'one',
          visible: false,
          disabled: false,
          section: 'One',
        },
        two: {
          dataKey: 'two',
          columnName: 'two',
          visible: false,
          disabled: false,
          section: 'Two',
        },
      },
    }
    const { getByLabelText, getByText, container } = render(<ColumnOptions {...props} />)
    const oneCheckbox = getByLabelText('one')
    const twoCheckbox = getByLabelText('two')
    expect(container.querySelectorAll('.oneSection')).toHaveLength(0)
    expect(container.querySelectorAll('.allSections')).toHaveLength(1)
    expect(container.querySelectorAll('.section')).toHaveLength(2)
    expect(getByText('One')).toBeVisible()
    expect(getByText('Two')).toBeVisible()
    expect(oneCheckbox.checked).toBe(false)
    expect(twoCheckbox.checked).toBe(false)

    act(() => {
      fireEvent.click(oneCheckbox, 'first')
      fireEvent.click(twoCheckbox, 'second')
    })

    expect(props.onMenuCheckbox).toBeCalledTimes(2)
    expect(props.onMenuCheckbox).toBeCalledWith(expect.any(Object), props.headers.one)
    expect(props.onMenuCheckbox).toBeCalledWith(expect.any(Object), props.headers.two)
  })
})
