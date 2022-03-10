import { useTheme } from '@material-ui/core/styles'

import { RiskLevel } from '../../../shared'
import MiniIcon, { iconCache } from './MiniIcon'

describe('Geozone mini-icon', () => {
  let theme

  beforeAll(() => {
    theme = useTheme()
  })

  beforeEach(() => {
    Object.keys(iconCache).forEach(key => {
      delete iconCache[key]
    })
  })

  test('renders normal 24x24 icon', () => {
    const icon = MiniIcon({ risk: RiskLevel.HIGH, highlighted: false, theme })
    expect(icon.anchor).toEqual([12, 12])
    expect(icon.url).toMatch(/data:image\/svg\+xml;charset=utf-8,.*/)
    const decoded = decodeURIComponent(icon.url.split(',')[1])
    expect(decoded).toMatch(/width="24"/)
    expect(decoded).toMatch(/height="24"/)
  })

  test('renders highlighted 40x40 icon', () => {
    const icon = MiniIcon({ risk: RiskLevel.LOW, highlighted: true, theme })
    expect(icon.anchor).toEqual([20, 20])
    expect(icon.url).toMatch(/data:image\/svg\+xml;charset=utf-8,.*/)
    const decoded = decodeURIComponent(icon.url.split(',')[1])
    expect(decoded).toMatch(/width="40"/)
    expect(decoded).toMatch(/height="40"/)
  })

  test('renders from cache if exists', () => {
    MiniIcon({ risk: RiskLevel.MEDIUM, highlighted: true, theme })
    const key = Object.keys(iconCache)[0]
    iconCache[key] = 'testdata'
    const icon = MiniIcon({ risk: RiskLevel.MEDIUM, highlighted: true, theme })
    expect(icon).toEqual('testdata')
  })

  test('renders without cache even if other entries exist in cache', () => {
    MiniIcon({ risk: RiskLevel.HIGH, highlighted: false, theme })
    MiniIcon({ risk: RiskLevel.HIGH, highlighted: true, theme })
    MiniIcon({ risk: RiskLevel.MEDIUM, highlighted: false, theme })
    MiniIcon({ risk: RiskLevel.MEDIUM, highlighted: true, theme })
    MiniIcon({ risk: RiskLevel.LOW, highlighted: false, theme })
    Object.keys(iconCache).forEach(key => {
      iconCache[key] = 'testdata'
    })
    const icon = MiniIcon({ risk: RiskLevel.LOW, highlighted: true, theme })
    expect(icon).not.toEqual('testdata')
  })
})
