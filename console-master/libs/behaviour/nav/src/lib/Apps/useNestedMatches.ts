import { matchPath } from 'react-router-dom'

export type NestedMatchesProps = { nestedMatches: boolean }

export function getNestedMatches(route, match) {
  let nestedMatches = route === window.location.pathname
  if (nestedMatches) return nestedMatches

  if (match) {
    nestedMatches = !!matchPath(match, window.location.pathname.replace(/\/+$/, '') + window.location.hash)
  }
  return nestedMatches
}

export const useNestedMatches = (nestedRoutes): NestedMatchesProps => {
  let nestedMatches = false
  for (const nestedRoute of nestedRoutes) {
    nestedMatches = getNestedMatches(nestedRoute.route, nestedRoute.match)
    if (nestedMatches) break
  }

  return { nestedMatches }
}
