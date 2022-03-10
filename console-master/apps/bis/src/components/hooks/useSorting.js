import { useCallback, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useSorting = ({ key, initSortBy, initSortDirection } = {}) => {
  const historyKey = `${key}.sorting`
  const navigate = useNavigate()
  const location = useLocation()
  const sortingRef = useRef()
  if (!sortingRef.current) {
    const historyState = window.history?.state?.usr
    sortingRef.current = (historyState && historyState[historyKey]) || { sortBy: initSortBy, sortDirection: initSortDirection }
  }
  const [sorting, setSorting] = useState(sortingRef.current)
  const saveSorting = useCallback(
    props => {
      sortingRef.current = props
      const { pathname, search = '', state: locationState } = location

      const newState = {
        ...locationState,
        [historyKey]: sortingRef.current,
      }
      navigate({ pathname, search }, { replace: true, state: newState })

      setSorting(props)
    },
    [navigate, location, historyKey],
  )
  return [sorting, saveSorting]
}

export default useSorting
