import { createCssVariablesTheme, createMuiTheme } from '@ues/assets'

import overrides from '../../theme/overrides'
import { MapClusterIcon, MapUserIcon } from './MapIcon'

describe('MapIcon', () => {
  const theme = createCssVariablesTheme(createMuiTheme({ colorScheme: 'light' }, overrides))

  it('MapUserIcon should be created properly', () => {
    const custom = {
      userId: 'u51',
      riskLevel: 'critical',
      size: 'large',
      theme,
    }
    const userIcon = MapUserIcon(custom)
    const key = `${custom.riskLevel}-${custom.size}`
    expect(userIcon.url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
    expect(userIcon.key).toEqual(key)
  })

  it('MapClusterIcon should be created properly', () => {
    const custom = {
      userId: 'u51',
      riskLevel: 'critical',
      count: 100,
      critical: 58,
      theme,
    }
    const clusterIcon = MapClusterIcon(custom)
    const key = `${custom.count}-${custom.critical}`
    expect(clusterIcon.url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
    expect(clusterIcon.key).toEqual(key)
  })
})
