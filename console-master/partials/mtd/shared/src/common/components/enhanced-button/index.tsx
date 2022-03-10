import React from 'react'

import type { ButtonProps } from '@material-ui/core'
import { Button, CircularProgress } from '@material-ui/core'

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean
  label: string
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({ loading = false, label, disabled = false, ...rest }) => (
  <Button {...rest} startIcon={loading ? <CircularProgress size="1rem" /> : rest?.startIcon} disabled={disabled}>
    {label}
  </Button>
)
