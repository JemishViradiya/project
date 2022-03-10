import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { ROUTE_PATH } from '../config/route'
import type { PolicyCreatorLocationState, PolicyFormValues } from '../model'

const PATH_REPLACEMENT_REGEXP = new RegExp(`${ROUTE_PATH}/.*$`)

export const useGoToPolicyCreatorCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (copiedValues?: PolicyFormValues) => {
      const state: PolicyCreatorLocationState = { copiedValues }

      navigate([location.pathname.replace(PATH_REPLACEMENT_REGEXP, ROUTE_PATH), 'create'].join('/'), { state })
    },
    [location, navigate],
  )
}
