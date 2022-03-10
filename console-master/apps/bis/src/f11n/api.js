import { parse } from 'query-string'

import { deserialize, HeaderName } from './f11n-core'

let { powerups, f11n = powerups } = parse(window.initialSearch || window.location.search || '')

let _json
let _headers
export const transport = {
  headers: () => _headers || (_headers = f11n ? { [HeaderName]: f11n } : {}),
  json: () => _json || (_json = deserialize(f11n)),
}

export const F11n = {
  get: () => f11n,
  set: value => {
    f11n = value
  },
}
