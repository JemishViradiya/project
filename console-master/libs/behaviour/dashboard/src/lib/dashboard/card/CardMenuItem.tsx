/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
}))

interface CardMenuItemProps {
  id: string
  option: string
  selected: boolean
  updateCardOptions(cardOptionProps: { id: string; option: string; value: boolean }): void
}

export const CardMenuItem = memo(({ id, option, selected, updateCardOptions }: CardMenuItemProps) => {
  const styles = useStyles()
  const { t } = useTranslation(['dashboard'])

  const handleUpdateOption = event => {
    updateCardOptions({
      id: id,
      option: option,
      value: !selected,
    })
  }

  return (
    <MenuItem onClick={handleUpdateOption}>
      <div className={styles.menuItem} data-testid={`${option}MenuItem_${id}`}>
        <FormControlLabel
          control={<Checkbox checked={selected} color="secondary" />}
          label={<Typography variant="body2">{t(`cardMenu.${option}`)}</Typography>}
        />
      </div>
    </MenuItem>
  )
})
