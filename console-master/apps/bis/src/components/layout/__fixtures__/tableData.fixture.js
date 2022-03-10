const DEFAULT_ROWS_COUNT = 1
const DEFAULT_OPTIONS = Object.freeze({
  rowsCount: DEFAULT_ROWS_COUNT,
})

const createTableData = ({ rowsCount = DEFAULT_ROWS_COUNT } = DEFAULT_OPTIONS) => {
  return Array(rowsCount)
    .fill()
    .map((_, index) => ({
      id: `ID_${index + 1}`,
      someData: 'SOME_DATA',
    }))
}

export { createTableData }
