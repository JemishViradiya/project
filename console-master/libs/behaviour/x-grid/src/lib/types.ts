import type { CSSProperties } from 'react'

import type { XGridProps as MuiXGridProps } from '@material-ui/x-grid'

export type NoRowsOverlayProps = {
  /**
   * The scoped custom message key displayed when the grid has no rows.
   * <namespace>:<messageKey>, for example "tables:noRows"
   */
  noRowsMessageKey?: string
}

export type XGridProps = Omit<MuiXGridProps, 'columns'> &
  NoRowsOverlayProps & {
    /**
     * Custom style used in the DIV wrapper.
     */
    wrapperStyle?: CSSProperties
    tableName?: string
    dense?: boolean
  }
