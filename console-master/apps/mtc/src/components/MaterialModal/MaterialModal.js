import React from 'react'
import { useTranslation } from 'react-i18next'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

import Button from '../Button/index'

export const MaterialModal = props => {
  const { t } = useTranslation()

  return (
    <div>
      <Dialog scroll="paper" open={props.open} onClose={props.onClose}>
        <DialogTitle disableTypography>
          <Typography variant="subtitle1">{props.title}</Typography>
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {props.content.map(content => (
            <Typography gutterBottom>{content}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button outlined onClick={props.onClose}>
            {t('global.cancel')}
          </Button>
          <Button id={props.submitText} variant="contained" onClick={props.onSubmit} color="primary">
            {props.submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default {
  title: 'Modal/Dialog',
}
