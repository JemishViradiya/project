import type { Location } from 'history'
import { useLocation } from 'react-router-dom'

export const useQueryParams = (defaultLocation?: Location): URLSearchParams => {
  const location = useLocation()

  return new URLSearchParams((defaultLocation ?? location).search)
}
