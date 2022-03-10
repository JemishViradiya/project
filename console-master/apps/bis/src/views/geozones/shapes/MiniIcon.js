import { RiskLevel } from '../../../shared'

// Exported only for testing
export const iconCache = {}

// There are two versions of the mini-icon. The normal size is 24x24, with a coloured background
// circle corresponding to the risk level. The geozone path that we have is a bit big to fit, so
// it is scaled to 75% and centered.
// The other version is 40x40 to allow for 8px white borders on all sides. The main addition is
// a 60% white circle, but the whole figure must be transformed so that the icon is still centered.
export default ({ risk, highlighted, theme }) => {
  const key = `geo-mini-${risk}-${highlighted}`
  if (iconCache[key]) {
    return iconCache[key]
  }

  const size = highlighted ? 40 : 24
  const center = size / 2
  let fill = theme.palette.bis.risk.high
  switch (risk) {
    case RiskLevel.MEDIUM:
      fill = theme.palette.bis.map.pin.medium
      break
    case RiskLevel.LOW:
      fill = theme.palette.bis.risk.low
      break
  }
  const highlightedOrEmpty = highlighted ? `<circle cx="${center}" cy="${center}" r="20" fill="white" fill-opacity="0.6" />` : ''
  const encoded = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${highlightedOrEmpty}
    <circle cx="${center}" cy="${center}" r="12" fill="${fill}" />
    <path fill="white" transform="translate(${center} ${center}) scale(0.75 0.75) translate(-12 -12)" d="M3,3V8H8V3ZM6.75,6.75H4.25V4.25h2.5ZM8,4.5v2h8v-2ZM16,3V8h5V3Zm3.75,3.75h-2.5V4.25h2.5ZM3,16v5H8V16Zm3.75,3.75H4.25v-2.5h2.5ZM8,17.5v2h8v-2ZM16,16v5h5V16Zm3.75,3.75h-2.5v-2.5h2.5ZM4.5,8v8h2V8Zm13,0v8h2V8Z"/>
  </svg>`)
  const url = `data:image/svg+xml;charset=utf-8,${encoded}`
  const icon = { key, url, anchor: [center, center] }
  iconCache[key] = icon
  return icon
}
