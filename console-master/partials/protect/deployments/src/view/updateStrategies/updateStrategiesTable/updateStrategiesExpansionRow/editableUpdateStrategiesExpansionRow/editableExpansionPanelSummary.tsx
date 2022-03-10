// dependencies
import moment from 'moment'
import type { MouseEvent } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

// components
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import type { StrategiesListItem } from '@ues-data/epp'

// utils
import { renderProducts } from './../updateStrategiesExpansionRow.utils'

interface EditablePanelSummaryPropTypes {
  values: StrategiesListItem
  onSaveEdit: (event: MouseEvent) => void
  onCancelEdit: (event: MouseEvent) => void
  isSubmitting: boolean
}

const EditableExpansionPanelSummary = ({ values, onSaveEdit, onCancelEdit, isSubmitting }: EditablePanelSummaryPropTypes) => {
  const { t: translate } = useTranslation(['deployments', 'general/form'])

  return (
    <Grid container alignItems="center" data-autoid="update-strategies-editable-summary">
      <Grid item xs={4} data-autoid="update-strategies-editable-summary-name">
        <Typography variant="subtitle2" noWrap>
          {values.name}
        </Typography>
      </Grid>
      <Grid item xs={2} data-autoid="update-strategies-editable-summary-products">
        {renderProducts(values)}
      </Grid>
      <Grid item xs={2} data-autoid="update-strategies-editable-summary-modified-date">
        <Typography variant="body2">{moment(values.modified).format('MM/DD/YYYY').toLocaleString()}</Typography>
      </Grid>
      <Grid item xs={4} container justifyContent="flex-end" spacing={4}>
        <Grid item>
          <Button variant="outlined" onClick={onCancelEdit} data-autoid="update-strategies-cancel-edit">
            {translate('general/form:commonLabels.cancel')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={onSaveEdit}
            disabled={isSubmitting}
            data-autoid="update-strategies-save-edit"
          >
            <Box position="absolute" display="flex" visibility={isSubmitting ? 'visible' : 'hidden'}>
              <CircularProgress color="secondary" size={20} />
            </Box>
            <Box visibility={isSubmitting ? 'hidden' : 'visible'}>{translate('general/form:commonLabels.save')}</Box>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EditableExpansionPanelSummary
