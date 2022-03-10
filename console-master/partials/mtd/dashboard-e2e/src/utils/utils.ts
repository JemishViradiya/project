import qs from 'query-string'

import { FeatureName } from '@ues-data/shared-types'

export const DASBOARD_START_TIMEOUT = 8000

export const escape = () => {
  // eslint-disable-next-line no-restricted-globals
  cy.get('body').type('{esc}')
}

export const cardLabel = (titleText, chartType) => titleText + ' ' + chartType //todo, put this through I.translate('cardLabel')

let donut, toplist, bar, line, count, pie

export const loadChartTypeStrings = (...ns: string[]) => {
  return I.loadI18nNamespaces(...ns, 'dashboard').then(() => {
    donut = I.translate('dashboard:donut')
    pie = I.translate('dashboard:pie')
    toplist = I.translate('dashboard:toplist')
    bar = I.translate('dashboard:bar')
    line = I.translate('dashboard:line')
    count = I.translate('dashboard:count')
  })
}

export { donut, toplist, bar, line, count, pie }

export const setLocalStorageState = (contentWindow = window) => {
  contentWindow.localStorage.clear()
  contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
  contentWindow.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
  contentWindow.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
  contentWindow.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
  contentWindow.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'true')
  contentWindow.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'true')
  contentWindow.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'true')
}

export const enableWidget = (widget: string) => {
  window.localStorage.setItem('EnabledWidgets', widget)
}

export const getParams = (redirectUrl: string | string[], uri: string) => {
  if (Array.isArray(redirectUrl)) redirectUrl = redirectUrl.find(r => r.indexOf(uri) !== -1)
  //return qs.parse(redirectUrl.substring(redirectUrl.indexOf(uri) + uri.length + 1))
  return new URLSearchParams(redirectUrl.substring(redirectUrl.indexOf(uri) + uri.length + 1))
}

export const expectUrlParams = () => {
  const recorded = []
  I.on('url:changed', url => recorded.push(url))

  return uri => getParams(recorded, uri)
}

export function getUrlHashRoute(urlHash: string): string {
  return urlHash.substr(1, urlHash.indexOf('?') - 1)
}

export function getSearchParams(urlHash: string): URLSearchParams {
  return new URLSearchParams(urlHash.substr(urlHash.indexOf('?') + 1))
}

export function findWaitByRole(id, options = {}) {
  options['timeout'] = DASBOARD_START_TIMEOUT
  return I.findByRole(id, options)
}

export function findWaitByRoleOptionsWithin(container, containerOptions, role, options = {}) {
  containerOptions['timeout'] = DASBOARD_START_TIMEOUT
  options['timeout'] = DASBOARD_START_TIMEOUT
  return I.findByRoleOptionsWithin(container, containerOptions, role, options)
}

export function findWaitByText(id, options = {}) {
  options['timeout'] = DASBOARD_START_TIMEOUT
  return I.findByText(id, options)
}

export function findWaitAllByRole(id, options = {}) {
  options['timeout'] = DASBOARD_START_TIMEOUT
  return I.findAllByRole(id, options)
}

export function findWaitByXGridCell(rowIndex, colIndex) {
  return I.findAllByRole('row', { timeout: DASBOARD_START_TIMEOUT })
    .get(`[aria-rowindex=${rowIndex}]`)

    .findAllByRole('cell', { timeout: DASBOARD_START_TIMEOUT })
    .filter(`[aria-colindex=${colIndex}]`)
}
