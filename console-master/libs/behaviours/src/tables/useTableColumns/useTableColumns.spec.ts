import { act, renderHook } from '@testing-library/react-hooks'

import type { TableColumn } from './../../components/Table'
import { FILTER_TYPES } from './../../filters'
import useTableColumns from './useTableColumns'

// constants
const MOCK_COLUMN_DATA: TableColumn[] = [
  {
    dataKey: 'x',
    label: 'key1',
    sortable: true,
    show: true,
    persistent: true,
    filterType: FILTER_TYPES.QUICK_SEARCH,
  },
  {
    dataKey: 'y',
    label: 'key2',
    sortable: true,
    show: false,
    persistent: false,
    filterType: FILTER_TYPES.NUMERIC,
  },
  {
    dataKey: 'z',
    label: 'key3',
    sortable: true,
    show: true,
    persistent: false,
    filterType: FILTER_TYPES.DATE_PICKER,
  },
]

describe('useTableColumns', () => {
  it('sets columns', () => {
    const { result } = renderHook(() => useTableColumns(MOCK_COLUMN_DATA))
    const { setVisibility } = result.current

    expect(result.current.columns).toEqual(MOCK_COLUMN_DATA)

    act(() => setVisibility(1))

    expect(result.current.columns[1].show).toEqual(true)
  })

  it('returns column visibility', () => {
    const { result } = renderHook(() => useTableColumns(MOCK_COLUMN_DATA))
    const { isColumnVisible } = result.current

    const actual = isColumnVisible(MOCK_COLUMN_DATA[0].dataKey) !== undefined

    expect(result.current.columns).toEqual(MOCK_COLUMN_DATA)
    expect(actual).toEqual(result.current.columns[0].show)
  })
})
