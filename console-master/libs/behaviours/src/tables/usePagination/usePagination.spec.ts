// dependencies
import { act, renderHook } from '@testing-library/react-hooks'

import usePagination from './usePagination'

describe('usePagination', () => {
  it('changes page', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.page).toEqual(0)

    act(() => result.current.onChangePage({}, 3))

    expect(result.current.page).toEqual(3)
  })

  it('sets page', () => {
    const { result } = renderHook(() => usePagination())

    act(() => result.current.setPage(3))

    expect(result.current.page).toEqual(3)
  })

  it('changes rows per page', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.page).toEqual(0)
    expect(result.current.rowsPerPage).toEqual(10)

    act(() => result.current.onChangePage({}, 2))

    expect(result.current.page).toEqual(2)
    expect(result.current.rowsPerPage).toEqual(10)

    act(() => result.current.onChangeRowsPerPage({ target: { value: '2' } }))

    expect(result.current.page).toEqual(0)
    expect(result.current.rowsPerPage).toEqual(2)

    act(() => result.current.onChangePage({}, 1))

    expect(result.current.page).toEqual(1)
    expect(result.current.rowsPerPage).toEqual(2)
  })

  it('sets rows per page', () => {
    const { result } = renderHook(() => usePagination())

    act(() => result.current.setRowsPerPage(15))

    expect(result.current.page).toEqual(0)
    expect(result.current.rowsPerPage).toEqual(15)

    act(() => result.current.onChangePage({}, 2))

    expect(result.current.page).toEqual(2)
    expect(result.current.rowsPerPage).toEqual(15)

    act(() => result.current.setRowsPerPage(25))

    expect(result.current.page).toEqual(2)
    expect(result.current.rowsPerPage).toEqual(25)
  })
})
