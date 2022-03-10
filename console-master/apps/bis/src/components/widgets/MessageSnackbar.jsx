import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { makeStyles } from '@material-ui/core/styles'

import Button from '../widgets/Button'

const useStyles = makeStyles(theme => ({
  // FIXME: Temporary styles. Need UX.
  success: {},
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}))

const MessageSnackbar = memo(({ open, message, variant, onClose }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const handleClose = useCallback(
    (_, reason) => {
      if (reason === 'clickaway') {
        return
      }
      if (onClose) onClose()
    },
    [onClose],
  )
  const actions = useMemo(
    () => [
      <Button variant="text" color="inherit" key="dismiss" size="small" onClick={handleClose}>
        {t('common.dismiss').toUpperCase()}
      </Button>,
    ],
    [handleClose, t],
  )

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes[variant]}
        aria-describedby="client-snackbar"
        message={<span id="client-snackbar">{message}</span>}
        action={actions}
      />
    </Snackbar>
  )
})

MessageSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['error', 'success']).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default MessageSnackbar
