import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import { UserAndGroupByQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { MockedApolloProvider } from '../../../../tests/utils'
import { default as UserAndGroupByQueryProvider } from '../../../providers/UserAndGroupByQueryProvider'
import StateProvider from './Autocomplete'

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn().mockImplementation(() => ({ data: [] })),
}))
const defaultProps = {
  addAppliedItem: () => {},
  setSearchText: () => {},
  appliedData: [],
  alreadyApplied: [],
}

const TEST_DATA = {
  directoryByName: {
    users: [
      {
        id: '4AEHeJvLt1iZO4cNxGE9U0mq1M2U=',
        info: {
          displayName: 'Alvera Bayer',
          primaryEmail: 'alvera54@gmail.com',
          username: 'Alvera.Gerhold',
        },
        __typename: 'BIS_DirectoryUser',
      },
    ],
    groups: [
      {
        id: 'group4',
        info: {
          name: 'Wyman - Schultz',
          description: 'Polarised zero defect protocol',
        },
        __typename: 'BIS_DirectoryGroup',
      },
    ],
  },
}

const defaultMocks = [
  {
    request: {
      query: UserAndGroupByQuery.query,
      fetchPolicy: 'cache-and-network',
      skip: false,
      variables: {
        query: 'searchText',
      },
    },
    result: {
      data: {
        directoryByName: {
          users: [],
          groups: [],
        },
      },
    },
  },
]

const testedComponent = (props = defaultProps, mocks = defaultMocks) => {
  return (
    <MockedApolloProvider mocks={mocks}>
      <UserAndGroupByQueryProvider>
        <StateProvider {...defaultProps} {...props} />
      </UserAndGroupByQueryProvider>
    </MockedApolloProvider>
  )
}

const createSut = (props, mocks) => {
  return render(testedComponent(props, mocks))
}

describe('Autocomplete tests', () => {
  afterEach(() => {
    cleanup()
  })

  it('can render', async () => {
    const sut = createSut()

    expect(sut).not.toBeNull()
    expect(sut.getByTitle('Search').firstChild).toHaveClass('searchIcon')
    expect(sut.getByTitle('Search').firstChild).toHaveClass('disabled')
  })

  it('type 1 character and nothing should happen', async () => {
    const setSearchTextMock = jest.fn()
    const sut = createSut({ setSearchText: setSearchTextMock })

    const input = sut.getByText('', { selector: 'input' })

    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } })
    })

    expect(setSearchTextMock).not.toHaveBeenCalledWith('a')

    await act(async () => {
      fireEvent.change(input, { target: { value: '' } })
    })
  })

  it('type 1 character and then click search button should trigger callback', async () => {
    const setSearchTextMock = jest.fn()
    const sut = createSut({ setSearchText: setSearchTextMock })
    const button = sut.getByText(/./, { selector: 'div > svg' })

    await act(async () => {
      await fireEvent.click(button)
    })

    expect(setSearchTextMock).toHaveBeenCalled()
  })

  it('type 3 characters should trigger callback', async () => {
    const setSearchTextMock = jest.fn()
    const sut = createSut({ setSearchText: setSearchTextMock })
    const input = sut.getByText('', { selector: 'input' })
    await act(async () => {
      await fireEvent.change(input, { target: { value: 'abc' } })
    })

    expect(setSearchTextMock).toHaveBeenCalledWith('abc')
  })

  it('should open popper with "No results" text after at least 3 characters are provided', async () => {
    const { getByText } = createSut()
    const expectedName = 'No results'
    const input = getByText('', { selector: 'input' })
    await act(async () => {
      await fireEvent.change(input, { target: { value: 'abc' } })
    })

    expect(getByText(expectedName)).not.toBeNull()
  })

  it('should list elements when valid data is provided and 3 characters have been typed', async () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ loading: false, error: undefined, data: TEST_DATA }))
    const { getByText } = createSut()
    const expectedUserText = 'Alvera Bayer (alvera54@gmail.com, Alvera.Gerhold)'
    const expectedGroupText = 'Wyman - Schultz'
    const input = getByText('', { selector: 'input' })
    await act(async () => {
      await fireEvent.change(input, { target: { value: 'abc' } })
    })

    expect(getByText(expectedUserText)).not.toBeNull()
    expect(getByText(expectedGroupText)).not.toBeNull()
  })

  it('should invoke addAppliedItem fn when given autocomplete item is clicked', async () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ loading: false, error: undefined, data: TEST_DATA }))
    const addAppliedItemMock = jest.fn()

    const { getByText } = createSut({ addAppliedItem: addAppliedItemMock })
    const userOptionText = 'Alvera Bayer (alvera54@gmail.com, Alvera.Gerhold)'
    const input = getByText('', { selector: 'input' })

    await act(async () => {
      await fireEvent.change(input, { target: { value: 'abc' } })
    })
    const option = getByText(userOptionText)

    await act(async () => {
      await fireEvent.click(option)
    })

    expect(addAppliedItemMock).toHaveBeenCalledTimes(1)
    expect(addAppliedItemMock).toHaveBeenCalledWith(TEST_DATA.directoryByName.users[0])
  })
})
