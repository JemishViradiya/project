// dependencies
import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

// components
import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import type { ProductType, StrategiesListItem } from '@ues-data/epp'
import { StrategyTypes } from '@ues-data/epp'

// utils
import { renderProductIcon } from './../updateStrategiesExpansionRow.utils'

interface StaticExpansionPanelDetailsPropTypes {
  values: StrategiesListItem
}

const StaticExpansionPanelDetails = ({ values }: StaticExpansionPanelDetailsPropTypes) => {
  const { t: translate } = useTranslation(['deployments'])

  const renderDescription = cond([
    [
      () => Boolean(values.description),
      () => (
        <Box mb={6} data-autoid="update-strategies-static-description">
          <Typography variant="body2">{values.description}</Typography>
        </Box>
      ),
    ],
  ])

  const renderStrategies = () =>
    values.strategies.map(strategy => (
      <Grid key={strategy.productName} container spacing={4} data-autoid="update-strategies-static-strategies">
        <Grid
          item
          lg={2}
          md={3}
          sm={3}
          xs={3}
          container
          alignItems="center"
          data-autoid="update-strategies-static-strategies-product"
        >
          <Box mr={2} display="flex">
            {renderProductIcon(strategy.productName as ProductType)}
          </Box>
          Cylance{strategy.productName.toUpperCase()}
        </Grid>
        <Grid
          item
          lg={10}
          md={9}
          sm={9}
          xs={9}
          container
          alignItems="center"
          data-autoid="update-strategies-static-strategies-type-version"
        >
          {translate(Object.values(StrategyTypes).find(s => s === strategy.strategyType))} - {strategy.version}
        </Grid>
      </Grid>
    ))

  return (
    <Fade in timeout={500}>
      <Box display="flex" width="100%" data-autoid="update-strategies-static-details">
        <Box pr={6}>
          <Box mb={6}>
            <Typography variant="subtitle2">{translate('Description')}</Typography>
          </Box>
          <Typography variant="subtitle2">{translate('Product')}</Typography>
        </Box>
        <Box width="100%">
          {renderDescription(undefined)}
          {renderStrategies()}
        </Box>
      </Box>
    </Fade>
  )
}

export default StaticExpansionPanelDetails
