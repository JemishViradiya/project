import type { Location } from 'history'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

export const useGoToPoliciesListCallback = () => {
  const location: Location<any> = useLocation()
  const navigate = useNavigate()

  return useCallback(() => {
    const locationState = location.state

    if (locationState && locationState.goBack) {
      const wh = window.history
      // NOTE: Safari sometimes adds an extra location history entry.
      // We add the check below to go back the expected location.
      if (!wh.state && wh.length >= 2) {
        navigate(-2)
      } else {
        navigate(-1)
      }
    } else {
      const pathname = location.pathname.replace(/\/adaptiveResponse\/.*$/, '/list/adaptiveResponse')
      navigate(pathname)
    }
  }, [location, navigate])
}
