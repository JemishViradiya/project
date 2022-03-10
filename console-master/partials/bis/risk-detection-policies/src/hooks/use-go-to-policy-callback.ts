import type { Location } from 'history'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { ROUTE_PATH } from '../config/route'

const PATH_REPLACEMENT_REGEXP = new RegExp(`${ROUTE_PATH}/.*$`)

export const useGoToPolicyCallback = () => {
  const navigate = useNavigate()
  const location: Location = useLocation()

  return useCallback(
    (policyId: string, view?: 'applied') => {
      const parts = [location.pathname.replace(PATH_REPLACEMENT_REGEXP, ROUTE_PATH), policyId, view]

      navigate(parts.filter(part => part !== undefined).join('/'))
    },
    [location.pathname, navigate],
  )
}
