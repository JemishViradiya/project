import { memo } from 'react'

import Shape, { ShapePropTypes } from './Shape'

const Circle = memo(shapeOptions => {
  return Shape(shapeOptions, 'Circle')
})

Circle.displayName = 'Circle'
Circle.propTypes = ShapePropTypes

export default Circle
