import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Chip, Collapse, Grid, useTheme } from '@material-ui/core'

import { boxPaddingProps } from '@ues/assets'

export const FilterOperators = ({ operatorsList, onSelectOperator, selectedOperator, showOperators }) => {
  const theme = useTheme()
  const { t } = useTranslation(['tables'])

  return (
    <Collapse in={showOperators}>
      <Box {...boxPaddingProps} bgcolor={theme.props['colors'].grey[50]}>
        <Grid container spacing={2}>
          {operatorsList.map(op => (
            <Grid item key={op}>
              <Chip
                clickable
                onClick={onSelectOperator(op)}
                label={t(op)}
                variant="outlined"
                color={selectedOperator === op ? 'secondary' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Collapse>
  )
}
