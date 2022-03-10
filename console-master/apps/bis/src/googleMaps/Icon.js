import PropTypes from 'prop-types'

const svgns = 'http://www.w3.org/2000/svg'

// given a DOM element, create a dataURL
export const dataURLFromSVGElement = el => {
  if (!el || el.tagName !== 'svg') return undefined
  // have to ensure that the namespace is set
  el.setAttribute('xmlns', svgns)
  const encoded = encodeURIComponent(el.outerHTML)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

// TODO: it would be nice to be able to declare this directly as a member of
// the google API class, but the API isn't loaded at this point
const PointPropType = PropTypes.oneOfType([
  PropTypes.object, // google maps API "Point" object
  PropTypes.arrayOf(PropTypes.number),
])

// because we can't distinguish between Point/Size objects,
// we are structurally identical here..
const SizePropType = PointPropType

export const IconPropType = PropTypes.shape({
  key: PropTypes.string, // just because...
  anchor: PointPropType,
  labelOrigin: PointPropType,
  origin: PointPropType,
  scaledSize: SizePropType,
  size: SizePropType,
  url: PropTypes.string.isRequired,
})
