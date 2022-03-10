// dependencies
import React from 'react'
import sinon from 'sinon'

import { renderHook } from '@testing-library/react-hooks'

import { FILTER_TYPES } from '../../filters'
import { SORT_DIRECTION } from './../useSort'
import useClientTable from './useClientTable'
// constants
const MOCK_TABLE_DATA = [
  {
    id: 'row1',
    name: 'row1 name',
    count: 10,
    date: '1/23/20',
  },
  {
    id: 'row2',
    name: 'row2 name',
    count: 5,
    date: '1/24/20',
  },
  {
    id: 'row3',
    name: 'row3 name',
    count: 23,
    date: '1/25/20',
  },
  {
    id: 'row4',
    name: 'row4 name',
    count: 7,
    date: '1/26/20',
  },
  {
    id: 'row5',
    name: 'row5 name',
    count: 9,
    date: '1/27/20',
  },
]

const MOCK_TABLE_DATA_2 = [
  {
    id: 'row1',
    name: 'row1 name',
    count: 10,
  },
  {
    id: 'row2',
    name: 'row2 name',
    count: 5,
  },
  {
    id: 'row3',
    name: 'row3 name',
    count: 23,
  },
  {
    id: 'row4',
    name: 'row4 name',
    count: 7,
  },
  {
    id: 'row5',
    name: 'row5 name',
    count: 9,
  },
  {
    id: 'row6',
    name: 'row6 name',
    count: 11,
  },
  {
    id: 'row7',
    name: 'row7 name',
    count: 4,
  },
  {
    id: 'row8',
    name: 'row8 name',
    count: 22,
  },
  {
    id: 'row9',
    name: 'row9 name',
    count: 8,
  },
  {
    id: 'row10',
    name: 'row10 name',
    count: 10,
  },
  {
    id: 'row11',
    name: 'row11 name',
    count: 101,
  },
]
const MOCK_COLUMN_DATA = [
  {
    dataKey: 'name',
    filterType: FILTER_TYPES.QUICK_SEARCH,
  },
  {
    dataKey: 'count',
    filterType: FILTER_TYPES.NUMERIC,
  },
  {
    dataKey: 'date',
    filterType: FILTER_TYPES.DATETIME_RANGE,
  },
]

describe('useClientTable', () => {
  it('returns default state', () => {
    const { result } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA,
        columns: MOCK_COLUMN_DATA,
      }),
    )

    expect(result.current.data).toEqual(MOCK_TABLE_DATA)
  })

  it('sorts data', () => {
    let sort = 'test'
    let sortDirection = SORT_DIRECTION.ASC

    const { result, rerender } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA,
        columns: MOCK_COLUMN_DATA,
        sort,
        sortDirection,
      }),
    )

    // ensure data reflects the change in sorting parameters

    expect(result.current.data).toEqual(MOCK_TABLE_DATA)

    sort = 'count'
    rerender()

    expect(result.current.data[0].id).toEqual('row2')
    expect(result.current.data[1].id).toEqual('row4')
    expect(result.current.data[2].id).toEqual('row5')
    expect(result.current.data[3].id).toEqual('row1')
    expect(result.current.data[4].id).toEqual('row3')

    sortDirection = SORT_DIRECTION.DESC
    rerender()

    expect(result.current.data[0].id).toEqual('row3')
    expect(result.current.data[1].id).toEqual('row1')
    expect(result.current.data[2].id).toEqual('row5')
    expect(result.current.data[3].id).toEqual('row4')
    expect(result.current.data[4].id).toEqual('row2')

    sort = 'name'
    sortDirection = SORT_DIRECTION.ASC
    rerender()

    expect(result.current.data[0].id).toEqual('row1')
    expect(result.current.data[1].id).toEqual('row2')
    expect(result.current.data[2].id).toEqual('row3')
    expect(result.current.data[3].id).toEqual('row4')
    expect(result.current.data[4].id).toEqual('row5')
  })

  it('filters data', () => {
    let activeFilters = {}

    const { result, rerender } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA,
        activeFilters,
        columns: MOCK_COLUMN_DATA,
      }),
    )

    // ensure data reflects the change in filtering parameters

    expect(result.current.data).toEqual(MOCK_TABLE_DATA)

    activeFilters = {
      name: { filterValue: { value: 'row', operator: 'Contains' } },
      count: { value: 10, operator: 'lessOrEqual' },
      date: { value: { min: '1/23/20', max: '1/26/20' } },
    }
    rerender()

    expect(result.current.data[0].id).toEqual('row1')
    expect(result.current.data[1].id).toEqual('row2')
    expect(result.current.data[2].id).toEqual('row4')
  })

  it('changes page', () => {
    let page = 0
    let rowsPerPage = 10

    const { result, rerender } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
      }),
    )

    // ensure data reflects the change in pagination parameters

    expect(result.current.data).toEqual(MOCK_TABLE_DATA)

    page = 3
    rerender()

    expect(result.current.data).toEqual([])

    page = 0
    rowsPerPage = 1
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[0]])

    page = 1
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[1]])

    page = 2
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[2]])

    page = 0
    rowsPerPage = 2
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[0], MOCK_TABLE_DATA[1]])

    page = 1
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[2], MOCK_TABLE_DATA[3]])

    page = 2
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[4]])
  })

  it('changes rows per page', () => {
    let page = 0
    let rowsPerPage = 10

    const { result, rerender } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
      }),
    )

    // ensure data reflects the change in pagination parameters

    expect(result.current.data).toEqual(MOCK_TABLE_DATA)

    rowsPerPage = 2
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[0], MOCK_TABLE_DATA[1]])

    page = 2
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[4]])

    page = 0
    rowsPerPage = 3
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[0], MOCK_TABLE_DATA[1], MOCK_TABLE_DATA[2]])

    page = 1
    rerender()

    expect(result.current.data).toEqual([MOCK_TABLE_DATA[3], MOCK_TABLE_DATA[4]])
  })

  it('updates its data on the first render and whenever a table param changes', () => {
    let page = 0
    let rowsPerPage = 10
    let sort = 'created'
    let sortDirection = SORT_DIRECTION.DESC

    // stub useState so it returns a spy
    const setDataSpy = sinon.spy()
    const useStateStub = sinon.stub(React, 'useState')
    useStateStub.returns([[], setDataSpy])

    const { rerender } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
        sort,
        sortDirection,
      }),
    )

    // ensure setData was called with initial tableData value

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0].data).toEqual(MOCK_TABLE_DATA)

    setDataSpy.resetHistory()

    // ensure setData is called with correct data whenever table params change

    rowsPerPage = 2
    rerender()

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0].data).toEqual([MOCK_TABLE_DATA[0], MOCK_TABLE_DATA[1]])

    setDataSpy.resetHistory()

    page = 1
    rerender()

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0].data).toEqual([MOCK_TABLE_DATA[2], MOCK_TABLE_DATA[3]])

    setDataSpy.resetHistory()

    sort = 'count'
    rerender()

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0].data).toEqual([MOCK_TABLE_DATA[4], MOCK_TABLE_DATA[3]])

    setDataSpy.resetHistory()

    sortDirection = SORT_DIRECTION.ASC
    rerender()

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0].data).toEqual([MOCK_TABLE_DATA[4], MOCK_TABLE_DATA[0]])

    useStateStub.restore()
  })

  it('ignores page when not provided', () => {
    const page = 0
    const rowsPerPage = 10
    const sort = 'created'
    const sortDirection = SORT_DIRECTION.DESC

    const { result } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA_2,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
        sort,
        sortDirection,
      }),
    )

    // ensure data was paginated
    expect(result.current.data.length).toEqual(10)
    expect(result.current.data).toEqual(MOCK_TABLE_DATA_2.slice(page, rowsPerPage))

    const { result: result2 } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA_2,
        columns: MOCK_COLUMN_DATA,
        sort,
        sortDirection,
      }),
    )

    // ensure data was not paginated
    expect(result2.current.data.length).toEqual(11)
    expect(result2.current.data).toEqual(MOCK_TABLE_DATA_2)
  })

  it('ignores sort when not provided', () => {
    const page = 0
    const rowsPerPage = 10
    const sort = 'count'
    const sortDirection = SORT_DIRECTION.ASC

    const { result } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA_2,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
        sort,
        sortDirection,
      }),
    )

    // ensure data was sorted
    expect(result.current.data.length).toEqual(10)
    expect(result.current.data).toEqual([
      MOCK_TABLE_DATA_2[6],
      MOCK_TABLE_DATA_2[1],
      MOCK_TABLE_DATA_2[3],
      MOCK_TABLE_DATA_2[8],
      MOCK_TABLE_DATA_2[4],
      MOCK_TABLE_DATA_2[0],
      MOCK_TABLE_DATA_2[9],
      MOCK_TABLE_DATA_2[5],
      MOCK_TABLE_DATA_2[7],
      MOCK_TABLE_DATA_2[2],
    ])

    const { result: result2 } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA_2,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
      }),
    )

    // ensure data was not sorted
    expect(result2.current.data.length).toEqual(10)
    expect(result2.current.data).toEqual(MOCK_TABLE_DATA_2.slice(page, rowsPerPage))
  })

  it('ignores filters when not provided', () => {
    const page = 0
    const rowsPerPage = 10
    const sort = 'count'
    const sortDirection = SORT_DIRECTION.ASC
    const activeFilters = {
      name: { filterValue: { value: 'row', operator: 'Contains' } },
      count: { value: 10, operator: 'lessOrEqual' },
    }

    const expected = [
      { id: 'row7', name: 'row7 name', count: 4 },
      { id: 'row2', name: 'row2 name', count: 5 },
      { id: 'row4', name: 'row4 name', count: 7 },
      { id: 'row9', name: 'row9 name', count: 8 },
      { id: 'row5', name: 'row5 name', count: 9 },
      { id: 'row1', name: 'row1 name', count: 10 },
      { id: 'row10', name: 'row10 name', count: 10 },
    ]

    const { result } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA_2,
        page,
        rowsPerPage,
        sort,
        sortDirection,
        activeFilters,
        columns: MOCK_COLUMN_DATA,
      }),
    )

    // ensure data was filtered
    expect(result.current.data.length).toEqual(expected.length)
    expect(result.current.data).toEqual(expected)

    const { result: result2 } = renderHook(() =>
      useClientTable({
        tableData: MOCK_TABLE_DATA_2,
        columns: MOCK_COLUMN_DATA,
        page,
        rowsPerPage,
      }),
    )

    // ensure data was not filtered
    expect(result2.current.data.length).toEqual(10)
    expect(result2.current.data).toEqual(MOCK_TABLE_DATA_2.slice(page, rowsPerPage))
  })
})
