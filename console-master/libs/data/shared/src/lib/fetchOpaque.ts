export type OpaqueResponse = {
  type: 'opaque' | 'error'
}

/**
 * Used for cross-origin calls to check if servers are reachable from FE.
 * Must be opaque due to CORS security.
 * @param endpoint
 * @param options
 */
export async function fetchOpaque(input: RequestInfo, init?: RequestInit): Promise<OpaqueResponse> {
  let resp: OpaqueResponse
  const response = await fetch(input, init)

  if (response.type === 'opaque') {
    resp = {
      type: 'opaque',
    }
  }
  // should never get here, but don't be tolerant
  else {
    resp = {
      type: 'error',
    }
  }
  return resp
}
