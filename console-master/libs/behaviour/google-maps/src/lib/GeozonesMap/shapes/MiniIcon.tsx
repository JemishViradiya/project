import { GeozoneType } from '../model'

const iconCache = {}

export interface MiniIcon {
  key: string
  url: string
  anchor: number[]
}

// There are three main versions of the mini-icon.
// 1. The normal size is 24x24, with a coloured background
// circle. The geozone path that we have is a bit big to fit, so
// it is scaled to 75% and centered. It can represent either circle or polygon
// 2. The 40x40 version of above to allow for 8px white borders on all sides. The main addition is
// a 60% white circle, but the whole figure must be transformed so that the icon is still centered.
// 3. Default pin - looks similar to the default marker provided by maps API

// copy of "libs/assets/src/icons/icons/basic-location.svg" from "@ues/assets" but with added "fill" for the main icon "path"
const getBasicLocationIcon = (size: number, fillColor: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}px" height="${size}px" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="${fillColor}" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1114.5 9a2.5 2.5 0 01-2.5 2.5z"/></svg>
`

// copy of "libs/assets/src/icons/icons/basic-geozoneShape.svg" from "@ues/assets"
const POLYGON_D =
  'M3,3V7H7V3ZM6,6H4V4H6ZM7,4.5v2H17v-2ZM17,3V7h4V3Zm3,3H18V4h2ZM3,17v4H7V17Zm3,3H4V18H6Zm1-2v2H17V18Zm10-1v4h4V17Zm3,3H18V18h2ZM4,7V17H6V7ZM18,7V17h2V7Z'

// copy of "libs/assets/src/icons/icons/basic-geozoneShape.svg" from "@ues/assets"
const CIRCLE_D =
  'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm3-8a3,3,0,1,1-3-3h0A3,3,0,0,1,15,12Z'

const getShapeIcon = (size: number, center: number, fillColor: string, highlighted: boolean, shapeType: GeozoneType) => {
  const highlightedPath = highlighted ? `<circle cx="${center}" cy="${center}" r="20" fill="white" fill-opacity="0.6" />` : ''
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${highlightedPath}
    <circle cx="${center}" cy="${center}" r="12" fill="${fillColor}" />
    <path fill="white" transform="translate(${center} ${center}) scale(0.75 0.75) translate(-12 -12)" d="${
    shapeType === GeozoneType.Circle ? CIRCLE_D : POLYGON_D
  }"/>
  </svg>
  `
}

export default ({
  defaultPin = false,
  highlighted,
  fillColor,
  shapeType,
}: {
  defaultPin?: boolean
  highlighted: boolean
  fillColor: string
  shapeType?: GeozoneType
}): MiniIcon => {
  const key = `geo-mini-${fillColor}-${highlighted}-${defaultPin}-${shapeType}`
  if (iconCache[key]) {
    return iconCache[key]
  }

  const size = defaultPin || highlighted ? 40 : 24
  const center = size / 2
  const encoded = encodeURIComponent(
    defaultPin ? getBasicLocationIcon(size, fillColor) : getShapeIcon(size, center, fillColor, highlighted, shapeType),
  )
  const url = `data:image/svg+xml;charset=utf-8,${encoded}`
  const icon = { key, url, anchor: [center, center] }
  iconCache[key] = icon
  return icon
}
