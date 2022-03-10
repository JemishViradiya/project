import { memo } from 'react'

import Shape, { ShapePropTypes } from './Shape'

const Polygon = memo(shapeOptions => {
  return Shape(shapeOptions, 'Polygon')
})

Polygon.displayName = 'Polygon'
Polygon.propTypes = ShapePropTypes

export default Polygon
