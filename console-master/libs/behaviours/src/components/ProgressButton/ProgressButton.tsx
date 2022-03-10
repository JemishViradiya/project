import React from 'react'
import { useTranslation } from 'react-i18next'

import { CircularProgress } from '@material-ui/core'
import type { ButtonProps } from '@material-ui/core/Button'
import Button from '@material-ui/core/Button'
import { makeStyles, useTheme } from '@material-ui/core/styles'

interface ProgressButtonProps extends ButtonProps {
  loading: boolean
  onClick?: () => void
}

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      position: 'relative',
      display: 'inline-block',
    },
    progress: {
      position: 'absolute',
      top: '50%',
      left: '50%',

      // by default, the official position of the progress
      // spinner element is determined by its top-left corner.
      // this makes the center of the spinner sit at that position
      marginTop: -theme.spacing(3),
      marginLeft: -theme.spacing(3),
    },
  }
})

const iconSize = {
  small: 16,
  medium: 24,
  large: 36,
}

const getIconSize = size => {
  if (size === undefined) return iconSize.medium
  return iconSize[size]
}

const ProgressButton = (options: ProgressButtonProps) => {
  const { t } = useTranslation(['components'])
  const { loading, onClick, size, ...rest } = options

  const theme = useTheme()
  const classes = useStyles(theme)

  const buttonClass = loading ? 'loading-state' : ''

  return (
    <div className={classes.wrapper}>
      <Button onClick={onClick} disabled={loading} className={buttonClass} size={size} {...rest}>
        {options.children ? options.children : t('progressButton.buttonText')}
      </Button>
      {loading && <CircularProgress className={classes.progress} size={getIconSize(size)} />}
    </div>
  )
}

export { ProgressButton, ProgressButtonProps }
