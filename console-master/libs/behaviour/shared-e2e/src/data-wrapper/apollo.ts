/**
 * Apollo query parameters interface
 */
interface ApolloQueryParams {
  /**
   * @param {Record<string, any} result the result object
   */
  result: Record<string, any> | boolean | string | number
  /**
   * @param {string} queryName the name of the apollo query
   */
  queryName: string
}

/**
 * A convenience data layer wrapper returning apollo data object.
 *
 * @param {AsyncQueryParams} params Query paramets
 * @return {any} Data object
 */
function apolloQuery(params: ApolloQueryParams) {
  const { result, queryName } = params
  return {
    // TODO: implement pagination:
    // data: apolloQuery('platformEndpoints', ecsPaginatedResult(entities))
    // Apollo returns:
    [queryName]: result,
  }
}

export { apolloQuery }
