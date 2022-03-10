import React from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

interface ModelCommandButtonProps {
  label: string
  isDisabled: boolean
  isDeviceOffline: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}

export const ModelCommandButton = React.memo(
  ({ label, isDisabled, isDeviceOffline, onClick, children }: ModelCommandButtonProps) => {
    const { t } = useTranslation(['persona/common'])

    const tooltipText = isDeviceOffline ? t('personaModelButton.AssociatedUserOffline') : label

    return (
      <Tooltip title={tooltipText} aria-label={tooltipText} placement="top" enterDelay={600}>
        <span>
          <IconButton
            data-autoid="persona-button-pause"
            aria-label={label}
            size="small"
            onClick={onClick}
            disabled={isDeviceOffline || isDisabled}
          >
            {children}
          </IconButton>
        </span>
      </Tooltip>
    )
  },
)
