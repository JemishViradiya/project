import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { render, screen } from '@testing-library/react'

import { useStatefulApolloQuery } from '@ues-data/shared'

import FilterOptions from './FilterOptions'

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn(),
}))

const props = {
  query: {},
  setRef: jest.fn(),
  t: jest.fn(x => x),
  field: 'FIELD', // string, required
  options: [{ key: 'KEY', label: 'LABEL', checked: false }],
  dataAccessor: data => data.userFilters,
}

describe('FilterOptions renderOptionsData works indirectly via renderData method', () => {
  it('renders without data when loading', () => {
    useStatefulApolloQuery.mockReturnValueOnce({ loading: true })
    render(<FilterOptions {...props} />)
    expect(screen.getByText('LABEL')).toBeTruthy()
    expect(screen.getByText('0')).toBeTruthy()
  })

  it('renders without data when error', () => {
    useStatefulApolloQuery.mockReturnValueOnce({ error: true })
    render(<FilterOptions {...props} />)
    expect(screen.getByText('LABEL')).toBeTruthy()
    expect(screen.getByText('0')).toBeTruthy()
  })

  it('renders with data', () => {
    const data = {
      userFilters: [
        { key: 'KEY', count: 1008 },
        { key: 'some other KEY', count: 3 },
      ],
    }
    useStatefulApolloQuery.mockReturnValueOnce({ data })
    render(<FilterOptions {...props} />)
    expect(screen.getByText('LABEL')).toBeTruthy()
    expect(screen.getByText('1008')).toBeTruthy()
  })
})
