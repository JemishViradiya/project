// dependencies
import { act, renderHook } from '@testing-library/react-hooks'

import useSelected from './useSelected'
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

describe('useSelected', () => {
  it('selects rows', () => {
    const { result } = renderHook(() => useSelected('id'))

    expect(result.current.selected).toEqual([])

    act(() => result.current.onSelect(MOCK_TABLE_DATA[1]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id])

    act(() => result.current.onSelect(MOCK_TABLE_DATA[3]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id, MOCK_TABLE_DATA[3].id])

    act(() => result.current.onSelect(MOCK_TABLE_DATA[0]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id, MOCK_TABLE_DATA[3].id, MOCK_TABLE_DATA[0].id])

    act(() => result.current.onSelect(MOCK_TABLE_DATA[3]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id, MOCK_TABLE_DATA[0].id])

    act(() => result.current.onSelect(MOCK_TABLE_DATA[1]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[0].id])

    act(() => result.current.onSelect(MOCK_TABLE_DATA[0]))

    expect(result.current.selected).toEqual([])
  })

  it('sets selected', () => {
    const { result } = renderHook(() => useSelected('id'))

    expect(result.current.selected).toEqual([])

    act(() => result.current.setSelected([MOCK_TABLE_DATA[1].id]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id])

    act(() => result.current.setSelected([MOCK_TABLE_DATA[1].id]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id])

    act(() => result.current.setSelected([MOCK_TABLE_DATA[2].id, MOCK_TABLE_DATA[3].id]))

    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[2].id, MOCK_TABLE_DATA[3].id])
  })

  it('selects all rows', () => {
    const { result } = renderHook(() => useSelected('id'))

    expect(result.current.selected).toEqual([])

    // select all
    act(() => result.current.onSelectAll({ target: { checked: true } }, MOCK_TABLE_DATA))

    // all selected
    expect(result.current.selected).toEqual(MOCK_TABLE_DATA.map(item => item.id))

    // unselect all
    act(() => result.current.onSelectAll({ target: { checked: false } }, MOCK_TABLE_DATA))

    // none selected
    expect(result.current.selected).toEqual([])

    // select some
    act(() => result.current.onSelect(MOCK_TABLE_DATA[1]))
    act(() => result.current.onSelect(MOCK_TABLE_DATA[3]))

    // some selected
    expect(result.current.selected).toEqual([MOCK_TABLE_DATA[1].id, MOCK_TABLE_DATA[3].id])

    // select all
    act(() => result.current.onSelectAll({ target: { checked: true } }, MOCK_TABLE_DATA))

    // all selected
    // expect(result.current.selected).toEqual(MOCK_TABLE_DATA.map(item => item.id))

    // unselect all
    act(() => result.current.onSelectAll({ target: { checked: false } }, MOCK_TABLE_DATA))

    // none selected
    expect(result.current.selected).toEqual([])
  })

  it('determines if a row is selected', () => {
    const { result } = renderHook(() => useSelected('id'))

    act(() => result.current.onSelect(MOCK_TABLE_DATA[1]))
    act(() => result.current.onSelect(MOCK_TABLE_DATA[3]))

    expect(result.current.isSelected(MOCK_TABLE_DATA[1])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[3])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[2])).toBe(false)
    expect(result.current.isSelected(MOCK_TABLE_DATA[4])).toBe(false)
  })

  it('omits data specfied by the omit function', () => {
    const omit = row => row.id === 'row3'
    const { result } = renderHook(() => useSelected('id'))

    expect(result.current.selected).toEqual([])

    // select all
    act(() => result.current.onSelectAll({ target: { checked: true } }, MOCK_TABLE_DATA, omit))

    expect(result.current.selected.length).toEqual(4)
    expect(result.current.selected[0]).toEqual(MOCK_TABLE_DATA[0].id)
    expect(result.current.selected[1]).toEqual(MOCK_TABLE_DATA[1].id)
    expect(result.current.selected[2]).toEqual(MOCK_TABLE_DATA[3].id)
    expect(result.current.selected[3]).toEqual(MOCK_TABLE_DATA[4].id)
    expect(result.current.selected.indexOf(MOCK_TABLE_DATA[2].id)).toEqual(-1)

    // unselect all
    act(() => result.current.onSelectAll({ target: { checked: false } }, MOCK_TABLE_DATA))

    expect(result.current.selected).toEqual([])
  })

  it('selected could be set by default', () => {
    const { result } = renderHook(() =>
      useSelected(
        'id',
        undefined,
        MOCK_TABLE_DATA.map(i => i.id),
      ),
    )

    expect(result.current.isSelected(MOCK_TABLE_DATA[0])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[1])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[2])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[3])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[4])).toBe(true)
  })

  it('selected could be set by default', () => {
    const { result } = renderHook(() =>
      useSelected(
        'id',
        undefined,
        MOCK_TABLE_DATA.map(i => i.id).filter((_, index) => index % 2 === 0),
      ),
    )

    expect(result.current.isSelected(MOCK_TABLE_DATA[1])).toBe(false)
    expect(result.current.isSelected(MOCK_TABLE_DATA[3])).toBe(false)
    expect(result.current.isSelected(MOCK_TABLE_DATA[0])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[2])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[4])).toBe(true)
  })

  it('selected item could be defined by idFunction', () => {
    const { result } = renderHook(() =>
      useSelected(
        undefined,
        item => item.id,
        MOCK_TABLE_DATA.map(i => i.id).filter((_, index) => index % 2 === 0),
      ),
    )

    expect(result.current.isSelected(MOCK_TABLE_DATA[1])).toBe(false)
    expect(result.current.isSelected(MOCK_TABLE_DATA[3])).toBe(false)
    expect(result.current.isSelected(MOCK_TABLE_DATA[0])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[2])).toBe(true)
    expect(result.current.isSelected(MOCK_TABLE_DATA[4])).toBe(true)
  })
})
