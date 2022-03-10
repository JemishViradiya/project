import { useMediaQuery } from '@material-ui/core'

const VERTICAL = 'vertical'
const HORIZONTAL = 'horizontal'

const getOrientation = isVertical => (isVertical ? VERTICAL : HORIZONTAL)

export const useViewportOrientation = (ratio = '1/1'): 'vertical' | 'horizontal' => {
  const isVertical = useMediaQuery(`(max-aspect-ratio: ${ratio})`)
  return getOrientation(isVertical)
}
