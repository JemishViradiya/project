import localState from './localState'
import { defaultValue } from './localState/UserListColumns'

describe('Local state', () => {
  it('init', () => {
    const cache = {
      writeQuery: jest.fn(),
    }
    localState.initialize(cache)
    expect(cache.writeQuery).toHaveBeenCalledTimes(7)
  })

  it('get from local storage', () => {
    localStorage.setItem('timePeriod', JSON.stringify({ last: 'LAST_MONTH' }))
    localStorage.setItem('eventListColumns', JSON.stringify({ columns: ['col1', 'col2'] }))
    localStorage.setItem('userListColumns', 'invalid json')
    const cache = {
      writeQuery: jest.fn(),
    }
    localState.initialize(cache)
    expect(cache.writeQuery).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          currentTimePeriod: {
            __typename: 'type_currentTimePeriod',
            last: 'LAST_MONTH',
            start: null,
            end: null,
            daysNumber: null,
          },
        }),
      }),
    )
    expect(cache.writeQuery).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventListColumns: {
            __typename: 'type_eventListColumns',
            columns: ['col1', 'col2'],
          },
        }),
      }),
    )
    expect(cache.writeQuery).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userListColumns: {
            __typename: 'type_userListColumns',
            columns: defaultValue,
          },
        }),
      }),
    )
  })

  it('get all mutations', () => {
    expect(localState.getMutations()).toMatchObject({
      updateEventListColumns: expect.any(Function),
      updateTimePeriod: expect.any(Function),
      updateGeozoneListColumns: expect.any(Function),
      updateUserInfoListColumns: expect.any(Function),
      updateUserListColumns: expect.any(Function),
    })
  })

  it('update time period', () => {
    const { updateTimePeriod } = localState.getMutations()
    const cache = {
      readQuery: jest.fn().mockImplementation(() => ({})),
      writeQuery: jest.fn(),
    }
    updateTimePeriod({}, { start: 12345, end: 23456 }, { cache })
    expect(cache.writeQuery).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          currentTimePeriod: {
            __typename: 'type_currentTimePeriod',
            last: null,
            start: 12345,
            end: 23456,
            daysNumber: null,
          },
        }),
      }),
    )
    expect(JSON.parse(localStorage.getItem('timePeriod'))).toMatchObject({
      start: 12345,
      end: 23456,
    })
  })

  it('update geozone columns', () => {
    const { updateGeozoneListColumns } = localState.getMutations()
    const cache = {
      readQuery: jest.fn().mockImplementation(() => ({})),
      writeQuery: jest.fn(),
    }
    updateGeozoneListColumns({}, { columns: ['col1', 'col2', 'col3'] }, { cache })
    expect(cache.writeQuery).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          geozoneListColumns: {
            __typename: 'type_geozoneListColumns',
            columns: ['col1', 'col2', 'col3'],
          },
        }),
      }),
    )
    expect(JSON.parse(localStorage.getItem('geozoneListColumns'))).toMatchObject({
      columns: ['col1', 'col2', 'col3'],
    })
  })
})
