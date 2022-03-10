/**
 * Async query parameters interface
 */
interface AsyncQueryParams {
  /**
   * @param {Record<string, any} result the result object
   */
  result: Record<string, any>
}

/**
 * A convenience data layer wrapper returning async query data object.
 *
 * @param {AsyncQueryParams} params Query paramets
 * @return {any} Data object
 */
function asyncQuery(params: AsyncQueryParams): any {
  const { result } = params
  return {
    // TODO: implement pagination:
    // data: asyncQuery('users', ecsPaginatedResult(users))
    // Async query returns:
    result,
  }
}

export { asyncQuery }
