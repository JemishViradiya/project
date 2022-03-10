/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import cn from 'clsx'
import type { OptionsObject } from 'notistack'
import { useSnackbar } from 'notistack'
import React from 'react'

import { Box, useTheme } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import type { Color } from '@material-ui/lab'
import { Alert } from '@material-ui/lab'

import type { UesTheme } from '@ues/assets'
import { BasicClose, BasicInfo, StatusLow, StatusMedium, StatusSuccess, Times } from '@ues/assets'

import useStyles from './styles'

enum Severity {
  Success = 'success',
  Warning = 'warning',
  Info = 'info',
  Error = 'error',
}

const SnackIcon = props => {
  const { variant } = props
  const theme = useTheme<UesTheme>()
  const classes = useStyles(theme)

  const getSnackIcon = () => {
    switch (variant) {
      case Severity.Info:
        return <BasicInfo className={classes.infoIcon} />
      case Severity.Warning:
        return <StatusMedium className={classes.warningIcon} />
      case Severity.Error:
        return <StatusLow className={classes.errorIcon} />
      default:
        return <StatusSuccess className={classes.successIcon} />
    }
  }
  const getCylanceNotificationIcon = () => {
    switch (variant) {
      case Severity.Warning:
        return <StatusMedium />
      case Severity.Info:
        return <BasicInfo />
      //return <InformationalCircle />;
      case Severity.Error:
        return <StatusLow />
      default:
        return <StatusSuccess />
      //return <CheckmarkCircle />;
    }
  }
  return theme.name === 'BB_BLUE' ? getSnackIcon() : getCylanceNotificationIcon()
}

export interface SnackbarMessageProps extends OptionsObject {
  /**
   * The text of the message to display.
   */
  messageText: string
}

/**
 * Default snackbar message.
 */
export const SnackbarMessage = React.forwardRef((props: SnackbarMessageProps, ref: React.Ref<JSX.Element>) => {
  const { messageText, variant, id } = props
  const styles = useStyles()
  const { closeSnackbar } = useSnackbar()
  const theme = useTheme<UesTheme>()

  const handleDismiss = () => {
    closeSnackbar(id)
  }

  let content
  if (theme.name === 'BB_BLUE') {
    content = (
      <Card className={cn(styles.card, styles[`${variant}Background`])} ref={ref} square={false}>
        <CardActions classes={{ root: styles.actionRoot }}>
          <Box display="flex" className={styles.containerBox}>
            <Box className={styles.startIcon}>
              <div>
                <SnackIcon variant={variant} />
              </div>
            </Box>
            <Box flexGrow={1}>
              <Typography variant="body2">{messageText}</Typography>
            </Box>
            <Box>
              <div className={styles.endIcon}>
                <IconButton onClick={handleDismiss} classes={{ root: styles.closeIconButton }}>
                  <BasicClose className={styles.closeIcon} />
                </IconButton>
              </div>
            </Box>
          </Box>
        </CardActions>
      </Card>
    )
  } else {
    content = (
      <Alert
        classes={{ root: styles.rootLegacy }}
        icon={<SnackIcon variant={variant} />}
        elevation={3}
        severity={variant as Color}
        variant="filled"
        action={
          <IconButton
            aria-label="close"
            size="small"
            color="inherit"
            onClick={() => {
              closeSnackbar(id)
            }}
          >
            <Times fontSize="small" />
          </IconButton>
        }
      >
        {messageText}
      </Alert>
    )
  }
  return content
})
