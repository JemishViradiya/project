import React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge, IconButton } from '@material-ui/core'

import { Filter } from '@ues/assets'

interface FilterIconProps {
  handleClick: (event: React.MouseEvent) => void
  modified?: boolean
  disabled?: boolean
}

export const FilterIcon: React.FC<FilterIconProps> = ({ handleClick, modified = false, disabled = false }: FilterIconProps) => {
  const { t } = useTranslation(['tables'])
  return (
    <IconButton onClick={handleClick} size="small" title={t('filterIcon')} disabled={disabled}>
      {modified ? (
        <Badge color="secondary" variant="dot">
          <Filter />
        </Badge>
      ) : (
        <Filter />
      )}
    </IconButton>
  )
}
