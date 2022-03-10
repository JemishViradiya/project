/* eslint-disable sonarjs/cognitive-complexity */
const sortString = (x1: string, x2: string) => x1.toString().localeCompare(x2)
const sortNumber = (x1: number, x2: number) => x1 - x2
const sortDate = (x1: Date, x2: Date) => x1.getTime() - x2.getTime()

export const compareValues = (v1, v2, sortDir: 'asc' | 'desc') => {
  if (v1 === undefined || v1 === null) {
    if (v2 === undefined || v2 === null) return 0
    return sortDir === 'asc' ? 1 : -1
  } else if (v2 === undefined || v2 === null) {
    return sortDir === 'asc' ? -1 : 1
  } else {
    switch (typeof v1) {
      case 'string':
        return sortDir === 'asc' ? sortString(v1, v2) : sortString(v2, v1)
      case 'number':
        return sortDir === 'asc' ? sortNumber(v1, v2) : sortNumber(v2, v1)
      case 'object':
        if (v1 instanceof Date) {
          return sortDir === 'asc' ? sortDate(v1, v2) : sortDate(v2, v1)
        } else return 0
      default:
        return 0
    }
  }
}
