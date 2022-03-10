import type { SensitiveDataQueryFilters } from '@ues-data/dlp'

export const sensitiveDataNavigate = (query): void => {
  let fileInventoryPath = 'uc/info#/file-inventory'

  window.location.assign(
    (fileInventoryPath += '?' + new URLSearchParams((query as SensitiveDataQueryFilters | unknown) as string).toString()),
  )
}
