import { act, renderHook } from '@testing-library/react-hooks'

import useColumns from './useColumns'

// constants
const MOCK_COLUMN_DATA = [
  {
    id: 'x',
    labelKey: 'key1',
    sortable: true,
    show: true,
    canToggle: false,
    filterType: 'text',
  },
  {
    id: 'y',
    labelKey: 'key2',
    sortable: true,
    show: false,
    canToggle: true,
    filterType: 'numeric',
  },
  {
    id: 'z',
    labelKey: 'key3',
    sortable: true,
    show: true,
    canToggle: true,
    filterType: 'date',
  },
]

describe('useColumns', () => {
  it('sets columns', () => {
    const { result } = renderHook(() => useColumns(MOCK_COLUMN_DATA))
    const { setVisibility } = result.current

    expect(result.current.columns).toEqual(MOCK_COLUMN_DATA)

    act(() => setVisibility(1))

    expect(result.current.columns[1].show).toEqual(true)
  })

  it('returns column visibility', () => {
    const { result } = renderHook(() => useColumns(MOCK_COLUMN_DATA))
    const { isColumnVisible } = result.current

    const actual = isColumnVisible(MOCK_COLUMN_DATA[0].id) !== undefined

    expect(result.current.columns).toEqual(MOCK_COLUMN_DATA)
    expect(actual).toEqual(result.current.columns[0].show)
  })
})
