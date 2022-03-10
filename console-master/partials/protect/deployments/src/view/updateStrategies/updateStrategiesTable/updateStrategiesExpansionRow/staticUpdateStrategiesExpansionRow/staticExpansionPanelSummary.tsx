// dependencies
import moment from 'moment'
import type { MouseEvent } from 'react'
import React from 'react'

// components
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import type { StrategiesListItem } from '@ues-data/epp'
import { BasicDelete, BasicEdit } from '@ues/assets'

// utils
import { renderProducts } from './../updateStrategiesExpansionRow.utils'

interface StaticExpansionPanelSummaryPropTypes {
  values: StrategiesListItem
  onToggleEdit: (event: MouseEvent) => void
  onDelete: (event: MouseEvent) => void
}

const StaticExpansionPanelSummary = ({ values, onToggleEdit, onDelete }: StaticExpansionPanelSummaryPropTypes) => (
  <Grid container alignItems="center" data-autoid="update-strategies-static-summary">
    <Grid item xs={4} data-autoid="update-strategies-static-name">
      <Typography variant="subtitle2" noWrap>
        {values.name}
      </Typography>
    </Grid>
    <Grid item xs={2} data-autoid="update-strategies-static-products">
      {renderProducts(values)}
    </Grid>
    <Grid item xs={2} data-autoid="update-strategies-static-modified-date">
      <Typography variant="body2">{moment(values.modified).format('MM/DD/YYYY').toLocaleString()}</Typography>
    </Grid>
    <Grid item xs={4} container justifyContent="flex-end">
      <IconButton onClick={onToggleEdit} data-autoid="update-strategies-edit">
        <BasicEdit />
      </IconButton>
      <IconButton onClick={onDelete} data-autoid="update-strategies-delete">
        <BasicDelete />
      </IconButton>
    </Grid>
  </Grid>
)

export default StaticExpansionPanelSummary
