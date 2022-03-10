import React from 'react'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'

import { CaretDown, TimesCircle } from '@ues/assets'

interface FilterChipIconProps {
  handleClick: (event: React.MouseEvent) => void
  handleClear?: () => void
  chipLabel: string
  open?: boolean
  modified?: boolean
  disabled?: boolean
}

export const FilterChipIcon: React.FC<FilterChipIconProps> = ({
  chipLabel,
  handleClick,
  handleClear,
  open,
  modified = false,
  disabled = false,
}: FilterChipIconProps) => {
  const getChipClassName = () =>
    ['MuiChip-selectable', modified && !disabled ? 'chip-selected' : '', open ? 'chip-open' : ''].join(' ')

  const label = !modified ? (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="body2">{chipLabel}</Typography>
      </Box>
      <CaretDown className="popover-chip-caret-down" />
    </Box>
  ) : (
    <Typography variant="body2">{chipLabel}</Typography>
  )

  return (
    <Chip
      label={label}
      disabled={disabled}
      variant="outlined"
      clickable
      onClick={handleClick}
      {...(modified && { onDelete: handleClear })}
      deleteIcon={<TimesCircle />}
      className={getChipClassName()}
    />
  )
}
