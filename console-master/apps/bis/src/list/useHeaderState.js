import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import useClientParams from '../components/hooks/useClientParams'

export default (headersProp, columnState = {}, updatecolumnState) => {
  const { t } = useTranslation()
  const privacyMode = useClientParams('privacyMode')
  const headers = useRef({})

  headers.current = useMemo(() => {
    const headers = {}
    headersProp.forEach(header => {
      const headerInstance = header(t)
      if (headerInstance.dataKey !== 'location' || !privacyMode.mode) {
        headers[headerInstance.dataKey] = headerInstance
      }
    })
    const headerKeys = columnState.columns
    if (headerKeys) {
      Object.keys(headers).forEach(key => {
        if (headerKeys.includes(key)) {
          headers[key].visible = true
        } else {
          // Disabled headers are always visible
          headers[key].visible = !!headers[key].disabled
        }
      })
    }
    return { headers }
  }, [columnState, headersProp, t, privacyMode.mode])

  const saveHeaderVisibility = useCallback(() => {
    const headerKeys = []
    Object.keys(headers.current.headers).forEach(key => {
      const header = headers.current.headers[key]
      if (header.visible && !header.disabled) {
        headerKeys.push(key)
      }
    })
    updatecolumnState({
      variables: {
        columns: headerKeys,
      },
    })
  }, [updatecolumnState])

  const onMenuAllSelection = useCallback(
    select => {
      const newHeaders = { ...headers.current }
      Object.keys(newHeaders.headers).forEach(key => {
        if (!newHeaders.headers[key].disabled) {
          newHeaders.headers[key].visible = select
        }
      })
      headers.current = newHeaders
      saveHeaderVisibility()
    },
    [saveHeaderVisibility],
  )

  const onMenuReset = useCallback(() => {
    const newHeaders = { ...headers.current }
    Object.keys(newHeaders.headers).forEach(key => {
      newHeaders.headers[key].visible = newHeaders.headers[key].defaultVisible
    })
    headers.current = newHeaders
    saveHeaderVisibility()
  }, [saveHeaderVisibility])

  const onMenuCheckbox = useCallback(
    key => {
      const newHeaders = { ...headers.current }
      newHeaders.headers[key].visible = !newHeaders.headers[key].visible
      headers.current = newHeaders
      saveHeaderVisibility()
    },
    [saveHeaderVisibility],
  )

  return {
    state: headers.current,
    onMenuAllSelection,
    onMenuCheckbox,
    onMenuReset,
    saveHeaderVisibility,
  }
}
