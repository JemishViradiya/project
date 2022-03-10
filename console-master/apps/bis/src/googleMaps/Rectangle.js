import { memo } from 'react'

import Shape, { ShapePropTypes } from './Shape'

const Rectangle = memo(shapeOptions => {
  return Shape(shapeOptions, 'Rectangle')
})

Rectangle.displayName = 'Rectangle'
Rectangle.propTypes = ShapePropTypes

export default Rectangle
