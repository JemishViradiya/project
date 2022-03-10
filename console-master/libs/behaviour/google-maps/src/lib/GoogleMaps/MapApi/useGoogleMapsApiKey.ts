import { resolveOverrideEnvironmentValue } from '@ues-data/shared'

export const useGoogleMapsApiKey = (): string => {
  // TO DO: FETCH API KEY FROM S3
  return resolveOverrideEnvironmentValue('UES_MAPS_API_KEY').value || (window as any).MOCK_GOOGLE_API_KEY
}
