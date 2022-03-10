import React from 'react'

import { render } from '@testing-library/react'

import { LocalGroupsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import LocalGroupsProvider from './LocalGroupsProvider'

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn().mockReturnValue({}),
}))

const defaultProps = {
  children: 'CHILDREN',
}

const createSut = () => render(<LocalGroupsProvider {...defaultProps} />)

describe('LocalGroupsProvider', () => {
  it('should call groups endpoint without directory groups', () => {
    createSut()

    expect(useStatefulApolloQuery).toHaveBeenCalledWith(LocalGroupsQuery, { variables: { isDirectoryLinked: false } })
  })
})
