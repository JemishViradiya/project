// dependencies
import { useCallback, useState } from 'react'

// constants
import { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } from './usePagination.constants'

export type UsePagination = {
  page: number
  rowsPerPage: number
  onChangePage: (_event: React.ChangeEvent<unknown>, newPage: number) => void
  onChangeRowsPerPage: ({
    target: { value },
  }: {
    target: {
      value: string
    }
  }) => void
  setPage: React.Dispatch<React.SetStateAction<number>>
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
}

function usePagination(defaultPage = DEFAULT_PAGE, defaultRowsPerPage = DEFAULT_ROWS_PER_PAGE): UsePagination {
  // state
  const [page, setPage] = useState(defaultPage)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  // actions

  const onChangePage = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }, [])

  const onChangeRowsPerPage = useCallback(
    ({ target: { value = defaultRowsPerPage.toString(10) } }: { target: { value: string } }) => {
      setRowsPerPage(parseInt(value, 10))
      setPage(defaultPage)
    },
    [defaultPage, defaultRowsPerPage],
  )

  // hook interface
  return {
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    setPage,
    setRowsPerPage,
  }
}

export default usePagination
