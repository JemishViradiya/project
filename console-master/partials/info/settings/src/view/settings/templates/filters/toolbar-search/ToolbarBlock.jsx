import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

import { BasicAdd, BasicCopy, BasicDelete, BasicStar } from '@ues/assets'

import { DATA_TYPES, STATUS } from '../../model/Template'

const I18NAME_SPACE = 'dlp/common'

function getI18Name(i18NameBase, name) {
  return `${i18NameBase}.${name}`
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  selected: {
    padding: theme.spacing(1),
  },
}))

const ToolbarBlock = ({ rowsSelected }) => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()
  if (rowsSelected.length === 0) {
    return (
      <Box>
        <Button variant="contained" color="primary" startIcon={<BasicAdd />} className={classes.button}>
          {t(getI18Name(I18NAME_SPACE.SETTING, 'template.buttons.newTemplate'))}
        </Button>
      </Box>
    )
  } else {
    return (
      <Box display="flex" flexDirection="row">
        <Box className={classes.selected}>
          <Typography color="primary" variant="subtitle1" className={classes.selected}>
            {rowsSelected.length} selected
          </Typography>
        </Box>

        {rowsSelected.length === 1 && (
          <Button variant="contained" color="primary" startIcon={<BasicCopy />} className={classes.button}>
            {t(getI18Name(I18NAME_SPACE.SETTING, 'template.buttons.duplicate'))}
          </Button>
        )}

        {rowsSelected.length >= 1 && rowsSelected.every(row => row.type === DATA_TYPES.PREDEFINED && row.status !== STATUS.IN_USE) && (
          <Button variant="contained" color="primary" startIcon={<BasicStar />} className={classes.button}>
            {t(getI18Name(I18NAME_SPACE.SETTING, 'template.buttons.addToYourList'))}
          </Button>
        )}

        {rowsSelected.length >= 1 && rowsSelected.every(row => row.type === DATA_TYPES.PREDEFINED && row.status === STATUS.IN_USE) && (
          <Button variant="contained" color="primary" startIcon={<BasicDelete />} className={classes.button}>
            {t(getI18Name(I18NAME_SPACE.SETTING, 'template.buttons.deleteFromYourList'))}
          </Button>
        )}

        {rowsSelected.length >= 1 && rowsSelected.every(row => row.type === DATA_TYPES.CUSTOM) && (
          <Button variant="contained" color="primary" startIcon={<BasicDelete />} className={classes.button}>
            {t(getI18Name(I18NAME_SPACE.SETTING, 'buttons.delete'))}
          </Button>
        )}
      </Box>
    )
  }
}
export default ToolbarBlock
