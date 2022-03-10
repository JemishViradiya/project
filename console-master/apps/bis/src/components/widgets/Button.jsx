import PropTypes from 'prop-types'
import React, { createElement, memo } from 'react'

import MaterialButton from '@material-ui/core/Button'

import Loading from '../util/Loading'

const DEFAULT_CONFIRMATION_BUTTON_VARIANT = 'contained'
const DEFAULT_CONFIRMATION_BUTTON_COLOR = 'primary'

const Button = memo(({ loading = false, ...materialButtonProps }) => {
  const { color = 'default' } = materialButtonProps
  const resolvedProps = loading
    ? {
        ...materialButtonProps,
        disabled: true,
        startIcon: <Loading inline color={materialButtonProps.disabled || color === 'default' ? 'primary' : 'inherit'} />,
      }
    : materialButtonProps

  return createElement(MaterialButton, resolvedProps)
})

Button.displayName = 'Button'
Button.propTypes = { ...MaterialButton.propTypes, loading: PropTypes.bool }

const ConfirmationButton = props =>
  createElement(Button, {
    variant: DEFAULT_CONFIRMATION_BUTTON_VARIANT,
    color: DEFAULT_CONFIRMATION_BUTTON_COLOR,
    ...props,
  })

ConfirmationButton.displayName = 'SaveButton'
ConfirmationButton.propTypes = Button.propTypes

Button.Confirmation = ConfirmationButton

export default Button
