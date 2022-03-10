import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useLocationChange = (action: () => void) => {
  const location = useLocation()

  useEffect(() => {
    action()
  }, [location.pathname, action])
}
