import { getSorting, stableSort } from './sorting'

const data = [
  { name: 'C', count: 3 },
  { name: 'A', count: 7 },
  { name: 'D', count: 2 },
  { name: 'H', count: 1 },
  { name: 'E', count: 6 },
  { name: 'B', count: 5 },
  { name: 'G', count: 8 },
  { name: 'F', count: 4 },
]

const flatData = ['C', 'A', 'D', 'H', 'E', 'B', 'G', 'F']
const flatDataSorted = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const flatData2 = [3, 5, 2, 7, 4, 8, 3, 9]
const flatData2Sorted = [2, 3, 3, 4, 5, 7, 8, 9]

const nameSorted = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const countSorted = [1, 2, 3, 4, 5, 6, 7, 8]

describe('Policies - Utils', () => {
  describe('stableSort', () => {
    it('should sort strings - ascending', () => {
      const result = stableSort(data, getSorting('asc', 'name'))
      expect(result.map(element => element.name)).toEqual(nameSorted)
    })

    it('should sort strings - descending', () => {
      const result = stableSort(data, getSorting('desc', 'name'))
      expect(result.map(element => element.name)).toEqual(nameSorted.reverse())
    })

    it('should sort strings - ascending', () => {
      const result = stableSort(data, getSorting('asc', 'count'))
      expect(result.map(element => element.count)).toEqual(countSorted)
    })

    it('should sort strings - descending', () => {
      const result = stableSort(data, getSorting('desc', 'count'))
      expect(result.map(element => element.count)).toEqual(countSorted.reverse())
    })

    it('should sort flat data - ascending', () => {
      let result = stableSort(flatData, getSorting('asc', null))
      expect(result).toEqual(flatDataSorted)

      result = stableSort(flatData, getSorting('asc', 'someNonexistentField'))
      expect(result).toEqual(flatDataSorted)

      let result2 = stableSort(flatData2, getSorting('asc', null))
      expect(result2).toEqual(flatData2Sorted)

      result2 = stableSort(flatData2, getSorting('asc', 'someNonexistentField'))
      expect(result2).toEqual(flatData2Sorted)
    })

    it('should sort flat data - desc', () => {
      let result = stableSort(flatData, getSorting('desc', null))
      expect(result).toEqual(flatDataSorted.slice().reverse())

      result = stableSort(flatData, getSorting('desc', 'someNonexistentField'))
      expect(result).toEqual(flatDataSorted.slice().reverse())

      let result2 = stableSort(flatData2, getSorting('desc', null))
      expect(result2).toEqual(flatData2Sorted.slice().reverse())

      result2 = stableSort(flatData2, getSorting('desc', 'someNonexistentField'))
      expect(result2).toEqual(flatData2Sorted.slice().reverse())
    })
  })
})
