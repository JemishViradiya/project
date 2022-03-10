import { UES_REGION } from './ues'

enum UESAPI_URLS {
  // labs (internal)
  QA2 = 'https://qa2-uesapi.cylance.com',
  R00 = 'https://r00-uesapi.cylance.com',
  R01 = 'https://r01-uesapi.cylance.com',
  // labs (external)
  R02 = 'https://r02-uesapi.cylance.com',
  LT = 'https://lt-uesapi.cylance.com',
  // prodcution
  US1 = 'https://us1-uesapi.cylance.com',
  EU1 = 'https://eu1-uesapi.cylance.com',
  JP1 = 'https://jp1-uesapi.cylance.com',
  AU1 = 'https://au1-uesapi.cylance.com',
  BR1 = 'https://br1-uesapi.cylance.com',
  GC1 = 'https://gc1-uesapi.cylance.com',
}

export const resolveEnvironment = (): string => {
  if (process.env.NODE_ENV !== 'production') {
    const isProxyEnv = new Set(['true', 1]).has(
      ((typeof globalThis.localStorage !== 'undefined' && globalThis.localStorage.UES_LOCAL_PROXY) || '').toLowerCase(),
    )

    if (isProxyEnv) {
      const styles = `padding: 2px 4px; background-color: cornflowerblue; color: white; font-weight:
         500; border-radius: 2px;`
      console.log('%cⓘ Local API Proxy Activated', styles)
      return '/local'
    }
  }

  const uesApiUrl = UESAPI_URLS[UES_REGION] || ''
  // console.log('host: ' + globalThis.location.host + ', uesApiUrl=' + uesApiUrl)
  return uesApiUrl + '/1db7e16b-a231-4495-be1a-90ef391f6ac8'
}

export const resolveAbsoluteApiUrl = (destinationUrl: string, protocol: 'https' | 'wss'): string => {
  if (destinationUrl.startsWith('/local/')) {
    const { port: apiPort, hostname } = globalThis.location
    const portOrEmpty = apiPort ? `:${apiPort}` : ''
    return `${protocol}://${hostname}${portOrEmpty}${destinationUrl}`
  } else {
    return destinationUrl.replace('https://', `${protocol}://`)
  }
}

export const UESAPI_URL = resolveEnvironment()
