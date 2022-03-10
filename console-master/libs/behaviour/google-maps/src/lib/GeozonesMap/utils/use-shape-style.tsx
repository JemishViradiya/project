import { useTheme } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'

import type { ShapeStyleOptions } from '../model'

export const useShapeStyle = (): ShapeStyleOptions => {
  const theme = useTheme<UesTheme>()
  return theme.palette.map.geozone.shape
}
