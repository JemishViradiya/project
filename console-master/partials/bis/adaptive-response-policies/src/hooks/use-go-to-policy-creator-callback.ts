import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

import type { PolicyCreatorLocationState, PolicyFormValues } from '../model'

export const useGoToPolicyCreatorCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (copiedValues?: PolicyFormValues) => {
      const state: PolicyCreatorLocationState = { copiedValues }

      navigate([location.pathname.replace(/\/adaptiveResponse\/.*$/, '/adaptiveResponse'), 'create'].join('/'), { state })
    },
    [location, navigate],
  )
}
