// drop the decimal point and any trailing zeros that don't provide knowledge
// (ie, "1.010" => "1.01", but "1.00" => "1")
//
// yes, you're right.  this isn't robust to locale changes.
// It will be ok in US, Canada, UK and Australia right now
export const dropZeros = n => {
  let truncateFrom = n.lastIndexOf('.')
  if (truncateFrom < 0) return n

  for (let i = truncateFrom + 1; i < n.length; i++) {
    if (n[i] !== '0') truncateFrom = i + 1
  }

  return n.slice(0, truncateFrom)
}

const digits = 3
const ascendingCases = [
  { belowThis: 1e6, scale: 1e3, category: '1e3' },
  { belowThis: 1e9, scale: 1e6, category: '1e6' },
  { belowThis: 1e12, scale: 1e9, category: '1e9' },
  { belowThis: 1e15, scale: 1e12, category: '1e12' },
]

// assuming n is a non-negative integer, find a shorter way of expressing it.
// TODO: language resources
const shorten = (n, t) => {
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error(`${n} is not a non-negative integer`)
  }
  // small integers special case
  if (n < 1e3) {
    const value = n.toFixed(0)
    if (value.length <= digits) {
      return t('common.shorten.1e0', { value })
    }
    // else rounding bumped it up
  }

  // try basically the same thing, scaling up by 1000 each time...
  for (const { belowThis, scale, category } of ascendingCases) {
    if (n < belowThis) {
      const nScaled = n / scale
      const value = nScaled.toFixed(0)
      if (value.length <= digits) {
        const prec = dropZeros(nScaled.toFixed(digits - value.length))
        return t(`common.shorten.${category}`, { value: prec })
      }
    }
    // else rounding bumped it up, so try the next one up
  }

  // .. sigh ... we give up
  return t('common.shorten.1eLarge', { value: n.toPrecision(3) })
}

export default shorten
