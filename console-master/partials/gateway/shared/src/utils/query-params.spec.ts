import { makeSortByQueryParam } from './query-params'

describe('makeSortByQueryParam', () => {
  it('should return undefined when sort is empty', () => {
    expect(makeSortByQueryParam({})).toStrictEqual(undefined)
  })

  it('should return valid sortBy param when sort is not empty', () => {
    expect(makeSortByQueryParam({ sortBy: 'rank', sortDir: 'asc' })).toStrictEqual('rank ASC')
  })

  it('should return valid sortBy param when sortDir is not defined', () => {
    expect(makeSortByQueryParam({ sortBy: 'rank' })).toStrictEqual('rank')
  })
})
