export function ssoRegionCheck() {
  const [, region] = document.cookie
    .split(';')
    .filter(cookie => cookie.includes('regionCode'))
    .toString()
    .split('=')
  localStorage.region = region
}
