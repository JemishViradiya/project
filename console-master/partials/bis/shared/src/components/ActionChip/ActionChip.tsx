import React, { memo } from 'react'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import { defaultChipProps } from '@ues/assets'

import useStyles from './styles'
import type { ActionChipProps } from './types'

const ActionChip = memo(({ canEdit, error, onDelete, ...restProps }: ActionChipProps) => {
  const styles = useStyles()
  return (
    <Box>
      <Chip variant="outlined" size="medium" {...(canEdit && { onDelete })} {...defaultChipProps} {...restProps} />
      <Typography variant="caption" color="error" className={styles.error}>
        {error}
      </Typography>
    </Box>
  )
})

export default ActionChip
