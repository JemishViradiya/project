// dependencies
import cond from 'lodash/cond'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core'
// components
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import type { StrategiesListItem } from '@ues-data/epp'
import { ChevronDown as ChevronDownIcon } from '@ues/assets'

import UpdateStrategiesExpansionRow from './updateStrategiesExpansionRow'
import useUpdateStrategiesTableStyles from './updateStrategiesTable.styles'

// constants
interface UpdateStrategiesTablePropTypes {
  updateStrategies: StrategiesListItem[]
  isStrategiesListPending: boolean
}

const UpdateStrategiesTable = ({ updateStrategies, isStrategiesListPending }: UpdateStrategiesTablePropTypes) => {
  const { t: translate } = useTranslation(['deployments'])
  const classes = useUpdateStrategiesTableStyles()
  const theme = useTheme()

  // render

  const renderLinearLoader = () => (
    <Box width="100%" data-autoid="deployments-update-strategies-list-linearLoader">
      <LinearProgress color="secondary" />
    </Box>
  )

  const renderCircularLoader = () => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      py={6}
      border={`1px solid ${theme.palette.grey.A100}`}
      data-autoid="deployments-update-strategies-list-circularLoader"
    >
      <CircularProgress color="secondary" />
    </Box>
  )

  const renderNoData = () => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      py={6}
      border={`1px solid ${theme.palette.grey.A100}`}
      data-autoid="deployments-update-strategies-list-noData"
    >
      <Typography variant="body2" color="textSecondary" align="center">
        {translate('NoDataAvailable')}
      </Typography>
    </Box>
  )

  const renderExpansionRows = () => (
    <>
      {updateStrategies.map(updateStrategy => (
        <UpdateStrategiesExpansionRow key={updateStrategy.updateStrategyId} updateStrategy={updateStrategy} />
      ))}
    </>
  )

  return (
    <>
      <Accordion classes={{ root: classes.accordionRoot, expanded: classes.accordionExpanded }} expanded={false}>
        <AccordionSummary expandIcon={<ChevronDownIcon className={classes.accordionIcon} />}>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography variant="button">{translate('StrategyName')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="button">{translate('Products')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="button">{translate('Modified')}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
      <div>
        {cond([[() => isStrategiesListPending, renderLinearLoader]])(undefined)}
        {cond([
          [() => isStrategiesListPending, renderCircularLoader],
          [() => !updateStrategies.length, renderNoData],
          [() => true, renderExpansionRows],
        ])(undefined)}
      </div>
    </>
  )
}

export default UpdateStrategiesTable
