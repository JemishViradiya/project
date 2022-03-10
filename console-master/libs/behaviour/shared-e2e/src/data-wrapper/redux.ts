/**
 * Async query parameters interface
 */
interface ReduxQueryParam {
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
function reduxQuery(params: ReduxQueryParam): any {
  const { result } = params
  return result
}

export { reduxQuery }
