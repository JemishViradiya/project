import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Chip, Collapse, Fade, Grid, Link, makeStyles, Tooltip, Typography } from '@material-ui/core'

import { chipsRootProps, chipsTransitionProps, chipTransitionProps } from '@ues/assets'

const MAX_WIDTH = 680

const useStyles = makeStyles(theme => ({
  label: {
    '& p': {
      maxWidth: MAX_WIDTH,
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
}))

const FilterChip = ({ label, onRemoveFilter, filterKey }) => {
  const chipRef = React.useRef(null)
  const [tooltip, setTooltip] = React.useState('')
  const classes = useStyles()

  const onDelete = useCallback(() => {
    onRemoveFilter(filterKey)
  }, [onRemoveFilter, filterKey])

  useEffect(() => {
    if (chipRef && chipRef.current) {
      const labelExceedsChipLength = chipRef.current.scrollWidth > MAX_WIDTH
      if (labelExceedsChipLength) {
        setTooltip(label)
      } else {
        setTooltip('')
      }
    }
  }, [label, chipRef])

  return (
    <Tooltip title={tooltip}>
      <Chip
        classes={classes}
        label={<Typography variant="body2">{label}</Typography>}
        aria-label={label}
        variant="outlined"
        size="small"
        ref={chipRef}
        onDelete={onDelete}
      />
    </Tooltip>
  )
}

export const AppliedFilterPanel = ({ hasActiveFilters, activeFilterLabels, onRemoveFilter, onClearFilters }) => {
  const { t } = useTranslation(['tables'])

  return (
    <Collapse in={hasActiveFilters} {...chipsTransitionProps}>
      <Box {...chipsRootProps}>
        <Grid container spacing={2}>
          {activeFilterLabels.map(({ label, filterKey }) => (
            <Grid item key={filterKey}>
              <Fade {...chipTransitionProps}>
                <FilterChip label={label} onRemoveFilter={onRemoveFilter} filterKey={filterKey} />
              </Fade>
            </Grid>
          ))}
        </Grid>
        <Link
          variant="body2"
          onClick={event => {
            event.preventDefault()
            onClearFilters()
          }}
        >
          {t('clear')}
        </Link>
      </Box>
    </Collapse>
  )
}
