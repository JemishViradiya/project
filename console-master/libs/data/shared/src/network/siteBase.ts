let siteBase: string | null = null

// This method returns the site path prefix based on if the current site
// is a production or a review one.
export const getSiteBase = (): string => {
  if (siteBase === null) {
    const url = new URL(document.baseURI)
    siteBase = url.href.slice(url.origin.length)
    console.trace('siteNetworkPrefix', siteBase)
  }
  return siteBase
}
