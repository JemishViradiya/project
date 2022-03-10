// dependencies
import { act, renderHook } from '@testing-library/react-hooks'

import useSort from './useSort'
import { DEFAULT_SORT, DEFAULT_SORT_DIRECTION, SORT_DIRECTION } from './useSort.constants'

describe('useSort', () => {
  it('changes sort', () => {
    const { result } = renderHook(() => useSort())

    expect(result.current.sort).toEqual(DEFAULT_SORT)
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)

    act(() => result.current.onSort('count'))

    expect(result.current.sort).toEqual('count')
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)

    act(() => result.current.onSort('count'))

    expect(result.current.sort).toEqual('count')
    expect(result.current.sortDirection).toEqual(SORT_DIRECTION.ASC)

    act(() => result.current.onSort('name'))

    expect(result.current.sort).toEqual('name')
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)

    act(() => result.current.onSort('count'))

    expect(result.current.sort).toEqual('count')
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)
  })

  it('sets sort', () => {
    const { result } = renderHook(() => useSort())

    expect(result.current.sort).toEqual(DEFAULT_SORT)
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)

    act(() => result.current.setSort('count'))

    expect(result.current.sort).toEqual('count')
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)

    act(() => result.current.setSort('count'))

    expect(result.current.sort).toEqual('count')
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)
  })

  it('sets sort direction', () => {
    const { result } = renderHook(() => useSort())

    expect(result.current.sort).toEqual(DEFAULT_SORT)
    expect(result.current.sortDirection).toEqual(DEFAULT_SORT_DIRECTION)

    act(() => result.current.setSortDirection(SORT_DIRECTION.ASC))

    expect(result.current.sort).toEqual(DEFAULT_SORT)
    expect(result.current.sortDirection).toEqual(SORT_DIRECTION.ASC)

    act(() => result.current.setSortDirection(SORT_DIRECTION.DESC))

    expect(result.current.sort).toEqual(DEFAULT_SORT)
    expect(result.current.sortDirection).toEqual(SORT_DIRECTION.DESC)
  })

  it('default sort could be set', () => {
    const { result } = renderHook(() => useSort('test'))
    expect(result.current.sort).toEqual('test')
  })

  it('default sort direction could be set', () => {
    const { result } = renderHook(() => useSort('', SORT_DIRECTION.ASC))
    expect(result.current.sortDirection).toEqual(SORT_DIRECTION.ASC)
  })
})
