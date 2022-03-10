export const isMobile = (osPlatform: string, entitlementId?: string) => {
  const lowerCasePlatform = osPlatform.toLowerCase()

  return (
    (!entitlementId || entitlementId === 'com.blackberry.ues') && (lowerCasePlatform === 'ios' || lowerCasePlatform === 'android')
  )
}
