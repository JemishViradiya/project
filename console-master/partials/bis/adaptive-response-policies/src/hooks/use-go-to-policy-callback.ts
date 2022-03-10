import type { Location } from 'history'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

export const useGoToPolicyCallback = () => {
  const navigate = useNavigate()
  const location: Location = useLocation()

  return useCallback(
    (policyId: string, view?: 'applied') => {
      const parts = [location.pathname.replace(/\/adaptiveResponse\/.*$/, '/adaptiveResponse'), policyId, view]

      navigate(parts.filter(part => part !== undefined).join('/'))
    },
    [location, navigate],
  )
}
