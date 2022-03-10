// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Sortable = any

const desc = (a: Sortable, b: Sortable, orderBy: string): -1 | 0 | 1 => {
  if (
    // dealing with primative values => compare primatives
    (typeof a === 'string' || typeof a === 'number') &&
    (typeof b === 'string' || typeof b === 'number')
  ) {
    if (b < a) {
      return -1
    }
    if (b > a) {
      return 1
    }
    return 0
  }

  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

const stableSort = <TArray extends Sortable>(array: Sortable[], cmp: (a: TArray, b: TArray) => number): TArray[] => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

const getSorting = (order: 'asc' | 'desc', orderBy: string): ((a: unknown, b: unknown) => number) => {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

export { desc, stableSort, getSorting }
