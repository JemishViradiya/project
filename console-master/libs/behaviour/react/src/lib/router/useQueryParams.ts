import { useLocation } from 'react-router-dom'

export const useQueryParams = (): URLSearchParams => new URLSearchParams(useLocation().search)
