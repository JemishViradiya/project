import { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useAutoZoom = variables => {
  const autoZoomCount = useRef(0)
  useMemo(() => {
    // Use an incremental number to indicate if a new auto zoom rendering is needed.
    autoZoomCount.current++
    return (
      variables.behavioralRiskLevel &&
      variables.geozoneRiskLevel &&
      variables.range &&
      variables.ids &&
      variables.selectMode &&
      variables.users
    )
  }, [
    variables.behavioralRiskLevel,
    variables.geozoneRiskLevel,
    variables.ids,
    variables.range,
    variables.selectMode,
    variables.users,
  ])
  return autoZoomCount
}

export const useSizeApi = ref => {
  const [hasSize, setHasSize] = useState(false)
  const size = useRef(0)
  useImperativeHandle(
    ref,
    () => ({
      setSize: sz => {
        const setState = sz && !size.current
        size.current = sz
        if (setState) {
          setHasSize(true)
        }
      },
    }),
    [size],
  )
  // By changing this when size changes, we invalidate children on re-render
  // This is a compromise between rendering on every resize and not re-rendering at all
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => size.current, [hasSize])
}

export const useMapViewStateSaver = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return useCallback(
    storageId => {
      if (!storageId) return
      const { pathname, search = '', state: locationState } = location
      const listMapView = sessionStorage.getItem(storageId)
      if (listMapView) {
        const newState = {
          ...locationState,
          listMapView: JSON.parse(listMapView),
        }

        navigate({ pathname, search }, { replace: true, state: newState })
      }
    },
    [navigate, location],
  )
}
