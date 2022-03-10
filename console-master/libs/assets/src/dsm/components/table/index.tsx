import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

const textCellStyles = (theme?: Theme) => ({
  twoLinesCell: {
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  },
  ellipsisTextCell: {
    overflow: 'hidden',
    'white-space': 'nowrap',
    textOverflow: 'ellipsis',
  },
})

export const useTextCellStyles = makeStyles<Theme>(textCellStyles)
export const makeTextCellStyles = textCellStyles
