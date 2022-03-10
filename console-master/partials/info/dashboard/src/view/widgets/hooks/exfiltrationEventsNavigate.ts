import type { ExfiltrationEventsQueryFilters } from '@ues-data/dlp'

export const exfiltrationEventsNavigate = (query): void => {
  let dlpEventsPath = 'uc/info#/events'

  window.location.assign(
    (dlpEventsPath += '?' + new URLSearchParams((query as ExfiltrationEventsQueryFilters | unknown) as string).toString()),
  )
}
