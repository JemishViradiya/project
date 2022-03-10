import { transformListRequestParams } from './transform-list-request-params'

describe('transformListRequestParams', () => {
  it('should transform sort param', () => {
    const result = transformListRequestParams({ sort: 'test', sortDirection: 'desc' })

    expect(result).toEqual({
      sort: '-test',
    })
  })

  it('should transform includeMeta param', () => {
    const result = transformListRequestParams({ includeMeta: true })

    expect(result).toEqual({
      includeMeta: true,
    })
  })

  it('should transform pagination param', () => {
    const result = transformListRequestParams({ page: 1, rowsPerPage: 10 })

    expect(result).toEqual({
      page: 1,
      pageSize: 10,
    })
  })

  it('should transform filters param', () => {
    const mockFilters = [{ userName: 'test' }, { state: 'online' }]
    const result = transformListRequestParams({ filters: mockFilters })

    expect(result).toEqual({
      userName: 'test',
      state: 'online',
    })
  })

  it('should ignore empty filters param', () => {
    const result = transformListRequestParams({ filters: [] })

    expect(result).toEqual({})
  })
})
