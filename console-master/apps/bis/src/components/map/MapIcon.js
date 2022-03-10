import { dataURLFromSVGElement } from '../../googleMaps/Icon'

const svgTextStyle = 'body2'
const svgTextStyleLarge = 'subtitle1'
const svgns = 'http://www.w3.org/2000/svg'

export const MapClusterIcon = ({ count, critical, formattedCount, theme }) => {
  const key = `${count}-${critical}`
  const el = document.createElementNS(svgns, 'svg')
  el.style.filter = 'drop-shadow(5px 1px 2px rgba(0, 0, 0, 0.5))'
  const maxShadowW = 7 // 5px + 2px for the blur
  const maxShadowH = 3 // 1px + 2px for the blur

  // Clusters use circles centered on the point
  const cx = theme.custom.bisMap.icon.width / 2
  const cy = theme.custom.bisMap.icon.height / 2

  const totalWidth = theme.custom.bisMap.icon.width + maxShadowW
  const totalHeight = theme.custom.bisMap.icon.height + maxShadowH

  el.setAttribute('width', totalWidth)
  el.setAttribute('height', totalHeight)
  el.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)

  const outerR = theme.custom.bisMap.icon.width / 2 - theme.custom.bisMap.icon.strokeWidth
  const circle = document.createElementNS(svgns, 'circle')
  circle.setAttribute('cx', cx)
  circle.setAttribute('cy', cy)
  circle.setAttribute('r', outerR)
  circle.style.fill = theme.palette.bis.risk.low
  circle.style.stroke = theme.palette.common.white
  circle.style.strokeWidth = `${theme.custom.bisMap.icon.strokeWidth}px`
  el.appendChild(circle)

  if (critical > 1) {
    if (critical / count > 0.99) {
      // If we have too many critical risk items, the red arc has problems when it turns into a circle.
      circle.style.fill = theme.palette.bis.risk.critical
    } else {
      const large = 2 * critical > count
      const angle = (2 * Math.PI * critical) / count - Math.PI / 2
      const r = outerR - theme.custom.bisMap.icon.strokeWidth / 2
      const arc = document.createElementNS(svgns, 'path')
      arc.setAttribute(
        'd',
        `M${cx} ${cy}L${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)} A${r} ${r} 0 ${large ? 1 : 0} 0 ${cx} ${cy - r}Z`,
      )
      arc.style.fill = theme.palette.bis.risk.critical
      el.appendChild(arc)
    }
  }

  const text = document.createElementNS(svgns, 'text')
  text.setAttribute('x', theme.custom.bisMap.icon.width / 2)
  text.setAttribute('y', theme.custom.bisMap.icon.height / 2 + 4)
  text.style.textAnchor = 'middle'
  Object.assign(text.style, theme.typography[svgTextStyleLarge])
  text.style.fill = theme.palette.common.white
  text.textContent = formattedCount || count.toString()
  el.appendChild(text)

  el.key = key

  const url = dataURLFromSVGElement(el)
  return { key, url, anchor: [cx, cy] }
}

const iconCache = {}
export const MapUserIcon = ({ riskLevel, size, theme }) => {
  const key = `${riskLevel}-${size || 'default'}`
  if (iconCache[key]) {
    return iconCache[key]
  }

  const width = theme.custom.bisMap.icon.user.width
  const height = theme.custom.bisMap.icon.user.height

  const el = document.createElementNS(svgns, 'svg')
  el.style.filter = 'drop-shadow(5px 1px 2px rgba(0, 0, 0, 0.5))'
  const maxShadowW = 7 // 5px + 2px for the blur
  const maxShadowH = 3 // 1px + 2px for the blur

  const totalWidth = width + maxShadowW
  const totalHeight = height + maxShadowH

  // Single map markers are centered above the point
  el.setAttribute('width', totalWidth)
  el.setAttribute('height', totalHeight)
  el.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)

  const path = document.createElementNS(svgns, 'path')
  path.style.stroke = theme.palette.common.white
  path.style.strokeWidth = theme.custom.bisMap.icon.strokeWidth
  path.style.fill = theme.palette.bis.risk.low
  if (riskLevel === 'CRITICAL') {
    path.style.fill = theme.palette.bis.risk.critical
  } else if (riskLevel === 'HIGH') {
    path.style.fill = theme.palette.bis.risk.high
  } else if (riskLevel === 'MEDIUM') {
    path.style.fill = theme.palette.bis.risk.medium
  } else if (riskLevel === 'LOW') {
    path.style.fill = theme.palette.bis.risk.low
  } else {
    path.style.fill = theme.palette.bis.risk.unknown
  }
  path.setAttribute(
    'd',
    'M13 1c-6.573 0-12.044 5.691-12.044 11.866 0 2.778 1.564 6.308 2.694 8.746l9.306 17.872 9.262-17.872c1.13-2.438 2.738-5.791 2.738-8.746 0-6.175-5.383-11.866-11.956-11.866z',
  )
  path.setAttribute('risk', riskLevel)
  el.appendChild(path)

  const person = document.createElementNS(svgns, 'path')
  person.style.fill = theme.palette.common.white
  person.setAttribute(
    'd',
    'M13,20.2C10.5,20.2 8.29,18.92 7,17C7.03,15 11,13.9 13,13.9C15,13.9 18.97,15 19,17C17.71,18.92 15.5,20.2 13,20.2M13,6A3,3 0 0,1 16,9A3,3 0 0,1 13,12A3,3 0 0,1 10,9A3,3 0 0,1 13,6Z',
  )
  el.appendChild(person)
  el.key = key

  const icon = {
    key,
    url: dataURLFromSVGElement(el),
    anchor: [width / 2, height],
  }

  if (size !== 'large') {
    icon.scaledSize = [0.8 * totalWidth, 0.8 * totalHeight]
    icon.anchor = [(0.8 * width) / 2, 0.8 * height]
  }
  iconCache[key] = icon
  return icon
}

export const MapHighlightIcon = ({ size, theme }) => {
  const key = `hl-${size}`
  if (iconCache[key]) {
    return iconCache[key]
  }

  const el = document.createElementNS(svgns, 'svg')

  const width = theme.custom.bisMap.icon.highlight.width
  const height = theme.custom.bisMap.icon.highlight.height

  const cx = width / 2
  const cy = height / 2

  el.setAttribute('width', width)
  el.setAttribute('height', height)
  el.setAttribute('viewBox', `0 0 ${width} ${width}`)

  const outerR = width / 2
  const circle = document.createElementNS(svgns, 'circle')
  circle.setAttribute('cx', cx)
  circle.setAttribute('cy', cy)
  circle.setAttribute('r', outerR)
  circle.style.fill = theme.palette.background.paper2
  el.appendChild(circle)

  el.key = key
  const url = dataURLFromSVGElement(el)
  const icon = { key, url, anchor: [cx, cy + theme.custom.bisMap.icon.user.height / 2] }
  if (size === 'large') {
    icon.scaledSize = [1.5 * width, 1.5 * width]
    icon.anchor = [icon.anchor[0] * 1.5, icon.anchor[1] * 1.5]
  }
  iconCache[key] = icon
  return icon
}

export const MapChartClusterIcon = ({ color, count, formattedCount, hover, theme }) => {
  /**
   * UX spec:
   * large (>= 100): 32px inside; 4px border
   * small (<= 99): 24px inside; 4px border
   * hover: +4px inside; +2px border; color changes
   */
  let radius = count >= 100 ? 16 : 12
  radius = hover ? radius + 2 : radius
  const key = `mcci-${color}-${count}-${hover}`
  const el = document.createElementNS(svgns, 'svg')

  const strokeWidth = hover ? 6 : 4
  const halfStrokeWidth = hover ? 3 : 2

  const width = 2 * (radius + strokeWidth)
  const height = width

  const cx = radius + strokeWidth
  const cy = cx

  el.setAttribute('width', width)
  el.setAttribute('height', height)
  el.setAttribute('viewBox', `0 0 ${width} ${width}`)

  // In one circle, 'fill' and 'stroke' will overlap half of the stroke width.
  // We need to use two circles to avoid overlap.
  const circle = document.createElementNS(svgns, 'circle')
  circle.setAttribute('cx', cx)
  circle.setAttribute('cy', cy)
  circle.setAttribute('r', radius)
  circle.style.fill = color
  el.appendChild(circle)

  const outer = document.createElementNS(svgns, 'circle')
  outer.setAttribute('cx', cx)
  outer.setAttribute('cy', cy)
  outer.setAttribute('r', radius + halfStrokeWidth)
  outer.style.fillOpacity = '0'
  outer.style.stroke = hover ? '#FFFFFF' : color
  outer.style.strokeOpacity = hover ? '0.6' : '0.2'
  outer.style.strokeWidth = strokeWidth
  el.appendChild(outer)

  const text = document.createElementNS(svgns, 'text')
  text.setAttribute('x', cx)
  text.setAttribute('y', cy + 4)
  Object.assign(text.style, theme.typography[svgTextStyle])
  text.style.textAnchor = 'middle'
  text.style.fill = theme.palette.common.white
  text.textContent = formattedCount || count.toString()
  el.appendChild(text)

  el.key = key
  const url = dataURLFromSVGElement(el)
  return { key, url, anchor: [cx, cy] }
}

export const HeatmapClusterIcon = ({ color, count, formattedCount, hover, theme }) => {
  /**
   * UX spec:
   * http://euxshare1.devlab2k.testnet.rim.net/YW47S2/#p=map_pins_obfuscated&g=1&fn=0
   */

  color = color || theme.palette.common.white

  const key = `hmci-${color}-${count}-${hover}`
  const el = document.createElementNS(svgns, 'svg')

  const size = count >= 100 || hover ? 28 : 24
  const halfSize = count >= 100 || hover ? 14 : 12
  const strokeWidth = hover ? 6 : 0
  const halfStrokeWidth = hover ? 3 : 0
  const width = size + 2 * strokeWidth
  const height = width

  const cx = strokeWidth + halfSize
  const cy = cx

  el.setAttribute('width', width)
  el.setAttribute('height', height)
  el.setAttribute('viewBox', `0 0 ${width} ${height}`)

  const rect = document.createElementNS(svgns, 'rect')
  rect.setAttribute('x', strokeWidth)
  rect.setAttribute('y', strokeWidth)
  rect.setAttribute('width', size)
  rect.setAttribute('height', size)
  rect.style.fill = color
  el.appendChild(rect)

  if (strokeWidth > 0) {
    const outer = document.createElementNS(svgns, 'rect')
    outer.setAttribute('x', halfStrokeWidth)
    outer.setAttribute('y', halfStrokeWidth)
    outer.setAttribute('width', width - strokeWidth)
    outer.setAttribute('height', height - strokeWidth)
    outer.style.fillOpacity = '0'
    outer.style.stroke = '#FFFFFF'
    outer.style.strokeOpacity = '0.6'
    outer.style.strokeWidth = strokeWidth
    el.appendChild(outer)
  }

  const text = document.createElementNS(svgns, 'text')
  text.setAttribute('x', cx)
  text.setAttribute('y', cy + 4)
  text.style.textAnchor = 'middle'
  Object.assign(text.style, theme.typography[svgTextStyle])
  text.style.fill = theme.palette.common.white
  text.textContent = formattedCount || count.toString()
  el.appendChild(text)

  el.key = key
  const url = dataURLFromSVGElement(el)
  return { key, url, anchor: [cx, cy] }
}
