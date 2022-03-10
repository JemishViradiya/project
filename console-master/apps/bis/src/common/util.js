/**
 * Remove any 'null' value property from objects (not from arrays).
 * @param {any type} data
 * @returns a new object/array or other original data.
 */
export const removeNull = data => {
  if (Array.isArray(data)) {
    return data.map(v => removeNull(v))
  }
  if (typeof data !== 'object' || data === null) return data
  const newObj = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      newObj[key] = removeNull(value)
    } else if (value !== null) {
      newObj[key] = value
    }
  })
  return newObj
}

export const arraySort = (sortKey, sortDirection) => (a, b) => {
  let akey = a[sortKey]
  let bkey = b[sortKey]
  if (typeof akey === 'string' || typeof bkey === 'string') {
    const aKeyStr = (akey || '').toLowerCase()
    const bKeyStr = (bkey || '').toLowerCase()
    if (aKeyStr !== bKeyStr) {
      akey = aKeyStr
      bkey = bKeyStr
    }
  }
  if (akey < bkey) {
    return sortDirection === 'ASC' ? -1 : 1
  } else if (akey > bkey) {
    return sortDirection === 'ASC' ? 1 : -1
  } else {
    return 0
  }
}

export const swapObjectKeysAndValues = obj => Object.assign({}, ...Object.entries(obj).map(([key, value]) => ({ [value]: key })))
