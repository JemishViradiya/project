import pullAll from 'lodash-es/pullAll'
import union from 'lodash-es/union'
import { parse, stringify } from 'query-string'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const urlSearch = useMemo(() => {
    return search ? parse(search) : {}
  }, [search])

  const updateUrlSearchItem = useCallback(
    (key, value, isAdd) => {
      if (!key || !value) {
        return
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return
        }
      } else {
        value = [value]
      }

      let oldValue = urlSearch[key]
      if (oldValue) {
        if (!Array.isArray(oldValue)) {
          oldValue = [oldValue]
        }
        value = isAdd ? union(value, oldValue) : pullAll(oldValue, value)
      }
      urlSearch[key] = value
      let search = stringify(urlSearch)
      if (search.length > 0) {
        search = `?${search}`
      }
      navigate({ pathname, search }, { replace: true })
    },
    [navigate, urlSearch, pathname],
  )

  const addUrlSearchItem = useCallback(
    (key, value) => {
      updateUrlSearchItem(key, value, true)
    },
    [updateUrlSearchItem],
  )

  const removeUrlSearchItem = useCallback(
    (key, value) => {
      updateUrlSearchItem(key, value, false)
    },
    [updateUrlSearchItem],
  )

  return { urlSearch, addUrlSearchItem, removeUrlSearchItem }
}
