import cond from 'lodash/cond'

import type { UesTheme } from '@ues/assets'

const getGaugeColor = (data: number, theme: UesTheme): string =>
  cond([
    [value => value < 33, () => theme.palette.chipAlert.high],
    [value => value >= 33 && value <= 66, () => theme.palette.chipAlert.medium],
    [() => true, () => theme.palette.chipAlert.secure],
  ])(data)

export { getGaugeColor }
