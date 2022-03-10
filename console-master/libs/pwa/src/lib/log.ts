import workbox from '../workbox'

const {
  _private: { getFriendlyURL },
} = workbox.core
const logger = console
const logLevel = 'info' as 'debug' | 'info' // 'debug'

const methodToColorMap = {
  debug: '#7f8c8d', // Gray
  log: '#2ecc71', // Green
  warn: '#f39c12', // Yellow
  error: '#c0392b', // Red
  groupCollapsed: '#3498db', // Blue
  groupEnd: null, // No colored prefix on groupEnd
}

const styles = method => `
  font-weight: normal;
  color: ${methodToColorMap[method]};
`

export const groupCollapsedStyle = styles('groupCollapsed')
export const logStyle = 'font-weight:normal'
export const urlStyle = `${logStyle};color:grey`

export default ({ name, cached, tag = 'sw:offline' }: { name: string; cached: string; tag?: string }) => (
  response: Response,
  event: FetchEvent,
  { cacheUrl = event.request.url }: { cacheUrl?: string } = {},
): Response => {
  // Workbox is going to handle the route.
  // print the routing details to the console.

  const groupArgs = [
    '%c%s%c %s is responding to: %c%s',
    groupCollapsedStyle,
    tag,
    logStyle,
    name,
    urlStyle,
    getFriendlyURL(event.request.url),
  ]
  if (logLevel === 'debug') {
    logger.groupCollapsed(...groupArgs)
    logger.log('Serving a %s reponse for: %s', cached, cacheUrl)

    logger.groupCollapsed('View request details here.')
    logger.log(event.request)
    logger.groupEnd()

    logger.groupCollapsed('View response details here.')
    logger.log(response)
    logger.groupEnd()

    logger.groupEnd()
  } else {
    console.log(...groupArgs)
  }
  return response
}
