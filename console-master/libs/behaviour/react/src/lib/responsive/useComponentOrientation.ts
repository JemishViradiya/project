import { useComponentSize } from './useComponentSize'
import { getHeight, getWidth } from './utils/size'

const VERTICAL = 'vertical'
const HORIZONTAL = 'horizontal'

const getOrientation = ({ current }, ratio) => {
  if (!current) return
  const currentRatio = getWidth(current) / getHeight(current)
  return currentRatio < ratio ? VERTICAL : HORIZONTAL
}

export const useComponentOrientation = (ref: React.RefObject<HTMLElement>, ratio = 1): ReturnType<typeof useComponentSize> => {
  return useComponentSize(ref, () => getOrientation(ref, ratio))
}
