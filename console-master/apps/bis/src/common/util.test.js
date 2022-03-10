import { arraySort, removeNull } from './util'

describe('removeNull', () => {
  test('remove nulls from an object', async () => {
    const data = {
      a: 'start',
      b: null,
      c: [7, { d: 8, e: null, f: ['abc', 2] }, null],
      d: [],
    }

    expect(removeNull(data)).toEqual({
      a: 'start',
      c: [7, { d: 8, f: ['abc', 2] }, null],
      d: [],
    })
  })

  test('remove nulls from complex array', async () => {
    const data = [
      'start',
      undefined,
      1,
      'abc',
      null,
      [2, null, { a: 3, b: null, c: [4, null, 5] }],
      {
        a: 6,
        b: null,
        c: [],
        d: [7, { d: 8, e: null, f: [] }, null],
        e: { f: null, g: 'ok', h: null },
        i: 'end',
      },
    ]

    expect(removeNull(data)).toEqual([
      'start',
      undefined,
      1,
      'abc',
      null,
      [2, null, { a: 3, c: [4, null, 5] }],
      {
        a: 6,
        c: [],
        d: [7, { d: 8, f: [] }, null],
        e: { g: 'ok' },
        i: 'end',
      },
    ])
  })
})

describe('arraySort', () => {
  const SortData = [
    'Darfur',
    'o2',
    '11',
    'oao',
    'DDD',
    'ddd',
    'OoO',
    'darfur',
    'DdD',
    'O2',
    'Ddd',
    'o1',
    'Oymyakon',
    'ooo',
  ].map(item => ({ item }))
  const SortASC = [
    '11',
    'Darfur',
    'darfur',
    'DDD',
    'DdD',
    'Ddd',
    'ddd',
    'o1',
    'O2',
    'o2',
    'oao',
    'OoO',
    'ooo',
    'Oymyakon',
  ].map(item => ({ item }))

  it('arraySort: ASC', () => {
    const result = SortData.sort(arraySort('item', 'ASC'))
    expect(result).toEqual(SortASC)
  })

  it('arraySort: DESC', () => {
    const result = SortData.sort(arraySort('item', 'DESC'))
    expect(result).toEqual(SortASC.reverse())
  })
})
