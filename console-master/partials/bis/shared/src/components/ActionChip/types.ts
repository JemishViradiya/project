import type { ChipProps } from '@material-ui/core'

export interface ActionChipProps extends ChipProps {
  canEdit?: boolean
  error?: string
}
