import { useTheme } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'

const MOUSE_DEVICE_TYPE = 'mouse'
const TOUCH_DEVICE_TYPE = 'touch'

export const usePointer = (): 'mouse' | 'touch' => {
  const { palette } = useTheme<UesTheme>()
  const touchDevice = palette.pointer === 'coarse'
  return touchDevice ? TOUCH_DEVICE_TYPE : MOUSE_DEVICE_TYPE
}
