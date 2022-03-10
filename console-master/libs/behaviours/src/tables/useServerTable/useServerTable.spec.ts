// dependencies
import React from 'react'
import sinon from 'sinon'

import { renderHook } from '@testing-library/react-hooks'

import useServerTable from './useServerTable'
// constants
const MOCK_TABLE_DATA = [
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
]

describe('useServerTable', () => {
  it('returns default state', () => {
    const { result } = renderHook(() =>
      useServerTable({
        tableData: MOCK_TABLE_DATA,
        dataDispatch: () => undefined,
      }),
    )

    expect(result.current.data).toEqual(MOCK_TABLE_DATA)
  })

  it('dispatches data on the first render', () => {
    const setSelectedSpy = sinon.spy()
    const dataDispatchSpy = sinon.spy()

    let tableData = MOCK_TABLE_DATA

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData,
        dataDispatch: dataDispatchSpy,
        setSelected: setSelectedSpy,
      }),
    )

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({})).toBe(true)

    // ensure spies are NOT called again when tableData changes

    setSelectedSpy.resetHistory()
    dataDispatchSpy.resetHistory()

    tableData = [
      {
        id: 'row1',
        name: 'row1 name',
        count: 10,
      },
    ]

    rerender()

    expect(setSelectedSpy.called).toBe(false)
    expect(dataDispatchSpy.called).toBe(false)
  })

  it('dispatches data when page changes', () => {
    const setSelectedSpy = sinon.spy()
    const dataDispatchSpy = sinon.spy()

    let page = 10
    const rowsPerPage = 100

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData: MOCK_TABLE_DATA,
        dataDispatch: dataDispatchSpy,
        setSelected: setSelectedSpy,
        page,
        rowsPerPage,
      }),
    )

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ page, rowsPerPage })).toBe(true)

    setSelectedSpy.resetHistory()
    dataDispatchSpy.resetHistory()

    page = 50

    rerender()

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ page, rowsPerPage })).toBe(true)
  })

  it('dispatches data when rowsPerPage changes', () => {
    const setSelectedSpy = sinon.spy()
    const dataDispatchSpy = sinon.spy()

    const page = 20
    let rowsPerPage = 200

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData: MOCK_TABLE_DATA,
        dataDispatch: dataDispatchSpy,
        setSelected: setSelectedSpy,
        page,
        rowsPerPage,
      }),
    )

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ page, rowsPerPage })).toBe(true)

    setSelectedSpy.resetHistory()
    dataDispatchSpy.resetHistory()

    rowsPerPage = 2000

    rerender()

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ page, rowsPerPage })).toBe(true)
  })

  it('dispatches data when sort changes', () => {
    const setSelectedSpy = sinon.spy()
    const dataDispatchSpy = sinon.spy()

    let sort = 'name'
    const sortDirection = 'asc'

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData: MOCK_TABLE_DATA,
        dataDispatch: dataDispatchSpy,
        setSelected: setSelectedSpy,
        sort,
        sortDirection,
      }),
    )

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ sort, sortDirection })).toBe(true)

    setSelectedSpy.resetHistory()
    dataDispatchSpy.resetHistory()

    sort = 'count'

    rerender()

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ sort, sortDirection })).toBe(true)
  })

  it('dispatches data when sortDirection changes', () => {
    const setSelectedSpy = sinon.spy()
    const dataDispatchSpy = sinon.spy()

    const sort = 'test'
    let sortDirection = 'asc'

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData: MOCK_TABLE_DATA,
        dataDispatch: dataDispatchSpy,
        setSelected: setSelectedSpy,
        sort,
        sortDirection,
      }),
    )

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ sort, sortDirection })).toBe(true)

    setSelectedSpy.resetHistory()
    dataDispatchSpy.resetHistory()

    sortDirection = 'desc'

    rerender()

    expect(setSelectedSpy.calledOnce).toBe(true)
    expect(setSelectedSpy.calledWith([])).toBe(true)
    expect(dataDispatchSpy.calledOnce).toBe(true)
    expect(dataDispatchSpy.calledWith({ sort, sortDirection })).toBe(true)
  })

  it('sets its data whenever tableData changes', () => {
    let tableData = MOCK_TABLE_DATA
    const dataDispatchSpy = sinon.spy()

    // stub useState so it returns a spy
    const setDataSpy = sinon.spy()
    const useStateStub = sinon.stub(React, 'useState')
    useStateStub.returns([[], setDataSpy])

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData,
        dataDispatch: dataDispatchSpy,
      }),
    )

    // ensure setData was called with initial tableData value

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0]).toEqual(MOCK_TABLE_DATA)

    setDataSpy.resetHistory()

    // ensure setData is called when tableData changes

    tableData = [
      {
        id: 'row2',
        name: 'row2 name',
        count: 22,
      },
      {
        id: 'row1',
        name: 'row1 name',
        count: 10,
      },
    ]

    rerender()

    expect(setDataSpy.calledOnce).toBe(true)
    expect(
      setDataSpy.calledWith([
        {
          id: 'row2',
          name: 'row2 name',
          count: 22,
        },
        {
          id: 'row1',
          name: 'row1 name',
          count: 10,
        },
      ]),
    ).toBe(true)

    useStateStub.restore()
  })

  it('consumes the value set by dataDispatch', () => {
    let page = 0
    let tableData = MOCK_TABLE_DATA

    const dataDispatchMock = () => {
      tableData = [
        {
          id: 'row5',
          name: 'row5 name',
          count: 9,
        },
      ]
    }

    // stub useState so it returns a spy
    const setDataSpy = sinon.spy()
    const useStateStub = sinon.stub(React, 'useState')
    useStateStub.returns([[], setDataSpy])

    const { rerender } = renderHook(() =>
      useServerTable({
        tableData,
        dataDispatch: dataDispatchMock,
        page,
      }),
    )

    expect(setDataSpy.calledOnce).toBe(true)
    expect(setDataSpy.firstCall.args[0]).toEqual(MOCK_TABLE_DATA)

    setDataSpy.resetHistory()

    page = 1

    rerender() // params changed => dataDispatchMock has been called, which changed tableData

    expect(setDataSpy.calledOnce).toBe(true)
    expect(
      setDataSpy.calledWith([
        {
          id: 'row5',
          name: 'row5 name',
          count: 9,
        },
      ]),
    ).toBe(true)

    useStateStub.restore()
  })
})
