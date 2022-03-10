import { useQueryParams } from './use-query-params'

export const useEventsLocationState = (): any => {
  const queryParams = useQueryParams()
  const locationStateValues = {}

  queryParams.forEach((value, key) => (locationStateValues[key] = value))

  return locationStateValues
}
