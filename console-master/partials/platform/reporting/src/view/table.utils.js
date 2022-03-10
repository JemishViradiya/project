import { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } from './table.constants'

// calculate the row data to return for the current page
const getPagedRows = (rowData = [], rowsPerPage = DEFAULT_ROWS_PER_PAGE, currentPage = DEFAULT_PAGE) => {
  // make sure it's always 1 and above
  // and is converted to zero-based number
  const page = Math.max(currentPage, DEFAULT_PAGE) - 1

  return rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}

export { getPagedRows }
