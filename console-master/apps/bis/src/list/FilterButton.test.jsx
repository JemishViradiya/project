import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import { useStatefulApolloQuery } from '@ues-data/shared'

import FilterButton from './FilterButton'

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn(),
}))

describe('FilterButton', () => {
  let props

  const resetProps = () => {
    props = {
      options: [
        {
          key: 'KEY',
          checked: false,
          label: 'Label',
          onToggle: jest.fn(() => (props.options[0].checked = !props.options[0].checked)),
          activeLabel: 'ACTIVE',
          activeColor: '#cafe00',
        },
      ],
      t: jest.fn(x => x),
      label: 'LABEL',
      field: 'FIELD',
      query: {},
      dataAccessor: data => data.userFilters,
    }
  }

  const t = global.T()

  beforeEach(resetProps)

  test('renders inactive button', () => {
    render(<FilterButton {...props} />)
    expect(screen.getByText('LABEL')).toBeTruthy()
    expect(screen.queryByLabelText('apply button')).not.toBeInTheDocument()
  })

  test('renders inactive button tooltip', async () => {
    const data = {
      userFilters: [{ key: 'KEY', count: 1008 }],
    }
    useStatefulApolloQuery.mockReturnValueOnce({ data })
    render(<FilterButton {...props} />)
    expect(screen.getByText('LABEL')).toBeTruthy()
    expect(screen.queryByLabelText('apply button')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('LABEL'))
    expect(await screen.findByLabelText('apply button')).toBeInTheDocument()
  })

  test('renders active button with close (x)', async () => {
    const data = {
      userFilters: [{ key: 'KEY', count: 1008 }],
    }
    useStatefulApolloQuery.mockReturnValueOnce({ data })
    props.options[0].checked = true

    render(<FilterButton {...props} />)
    expect(screen.queryByText('LABEL')).toBeFalsy()
    expect(screen.getByText(t(props.options[0].activeLabel))).toBeTruthy()

    // verify that clicking the close button works, and turns off check
    fireEvent.click(screen.getByLabelText('Close'))
    expect(props.options[0].onToggle).toHaveBeenCalled()
  })

  test('flow for checking an option from inactive button', async () => {
    const data = {
      userFilters: [{ key: 'KEY', count: 1008 }],
    }
    useStatefulApolloQuery.mockReturnValueOnce({ data })
    render(<FilterButton {...props} />)
    expect(screen.getByText('LABEL')).toBeTruthy()

    // renders inactive button, opens tooltip with click

    // no menu to start
    expect(screen.queryByLabelText('apply button')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('LABEL'))
    expect(await screen.findByLabelText('apply button')).toBeInTheDocument()

    // click checkbox
    fireEvent.click(screen.getByText('Label'))

    // click the apply button
    fireEvent.click(screen.getByText('Apply'))

    // apply should have toggled the check in our option
    expect(props.options[0].onToggle).toHaveBeenCalled()
    expect(props.options[0].checked).toBe(true)
  })

  test('flow for checking an option with an active button', async () => {
    const data = {
      userFilters: [
        { key: 'KEY', count: 1008 },
        { key: 'KEY_2', count: 1 },
      ],
    }
    useStatefulApolloQuery.mockReturnValueOnce({ data })
    // add another option with two active options
    props.options[0].checked = true
    props.options.push({
      key: 'KEY_2',
      checked: true,
      onToggle: jest.fn(() => (props.options[1].checked = !props.options[1].checked)),
      activeLabel: 'ACTIVE #2',
      activeColor: '#cafe02',
      label: 'Label 2',
    })

    render(<FilterButton {...props} />)
    expect(screen.queryByText('LABEL')).not.toBeInTheDocument()

    // renders active button, opens tooltip with click

    // no menu to start
    expect(screen.queryByLabelText('apply button')).not.toBeInTheDocument()

    // has the label of the active (active) option
    expect(screen.getByText(t(props.options[0].activeLabel))).toBeTruthy()
    expect(screen.getByText(t(props.options[1].activeLabel))).toBeTruthy()
    expect(screen.getAllByLabelText('Remove')).toHaveLength(2)

    fireEvent.click(screen.getByText(t(props.options[1].activeLabel)))
    expect(screen.getByLabelText('apply button')).toBeInTheDocument()

    // uncheck the active input box
    fireEvent.click(screen.getByText('Label 2'))

    // click the apply button
    fireEvent.click(screen.getByText('Apply'))

    // apply should have toggled the check in our option
    expect(props.options[0].onToggle).not.toHaveBeenCalled()
    expect(props.options[1].onToggle).toHaveBeenCalled()
    expect(props.options[1].checked).toBe(false)
  })
})
