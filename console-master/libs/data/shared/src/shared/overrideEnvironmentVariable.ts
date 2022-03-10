export const resolveOverrideEnvironmentVariable = (name: string): { enabled: boolean; src?: 'store' | 'env' } => {
  // build-time override
  if (process.env[name] && process.env[name] === 'true') {
    return { enabled: true, src: 'env' }
  }

  if (
    // *Storage override
    isLocalOverrideSupported() &&
    ((globalThis.sessionStorage && globalThis.sessionStorage[name] === 'true') ||
      (globalThis.localStorage && globalThis.localStorage[name] === 'true'))
  ) {
    return { enabled: true, src: 'store' }
  }

  return { enabled: false }
}

export const resolveOverrideEnvironmentValue = (name: string): { value?: string | number; src?: 'store' | 'env' } => {
  // build-time override
  if (process.env[name]) {
    return { value: process.env[name], src: 'env' }
  }

  // storage override
  const value =
    (globalThis.sessionStorage && globalThis.sessionStorage[name]) || (globalThis.localStorage && globalThis.localStorage[name])
  return isLocalOverrideSupported() && value ? { value, src: 'store' } : {}
}

export const isLocalOverrideSupported = (): boolean => {
  return process.env.LOCAL_STORAGE_OVERRIDE === 'true' || process.env.NODE_CONFIG_ENV === 'test'
}
