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

import type { UpdateRule } from '@ues-data/epp'
import { ChevronDown as ChevronDownIcon } from '@ues/assets'
import { useDragDrop } from '@ues/behaviours'

import UpdateRulesExpansionRow from './updateRulesExpansionRow'
import useUpdateRulesTableStyles from './updateRulesTable.styles'

// constants
interface UpdateRulesTablePropTypes {
  updateRules: UpdateRule[]
  isEditable: boolean
  isRulesListPending: boolean
  onDelete: (item: UpdateRule) => void
}

const DraggableExpansionPanels = ({ updateRules, isEditable, onDelete }: Partial<UpdateRulesTablePropTypes>) => {
  const { cards, moveCard } = useDragDrop(updateRules)

  return cards.map((updateRule, index) => (
    <UpdateRulesExpansionRow
      key={updateRule.id}
      index={index}
      length={cards.length}
      updateRule={updateRule}
      isEditable={isEditable}
      onDelete={onDelete}
      moveCard={moveCard}
    />
  ))
}

const UpdateRulesTable = ({ updateRules, isEditable, isRulesListPending, onDelete }: UpdateRulesTablePropTypes) => {
  const { t: translate } = useTranslation(['deployments'])
  const classes = useUpdateRulesTableStyles()
  const theme = useTheme()

  // render

  const renderLinearLoader = () => (
    <Box width="100%" data-autoid="deployments-update-rules-list-linearLoader">
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
      data-autoid="deployments-update-rules-list-circularLoader"
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
      data-autoid="deployments-update-rules-list-noData"
    >
      <Typography variant="body2" color="textSecondary" align="center">
        {translate('NoDataAvailable')}
      </Typography>
    </Box>
  )

  const renderExpansionPanels = () => (
    <DraggableExpansionPanels updateRules={updateRules} isEditable={isEditable} onDelete={onDelete} />
  )

  return (
    <>
      <Accordion classes={{ root: classes.accordionRoot, expanded: classes.accordionExpanded }} expanded={false}>
        <AccordionSummary expandIcon={<ChevronDownIcon className={classes.accordionIcon} />}>
          <Grid container alignItems="center">
            <Grid item xs={2}>
              <Typography variant="button">{translate('Order')}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="button">{translate('RuleName')}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="button">{translate('Zones')}</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="button">{translate('Strategy')}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
      {cond([[() => isRulesListPending, renderLinearLoader]])(undefined)}
      {cond([
        [() => isRulesListPending, renderCircularLoader],
        [() => !updateRules.length, renderNoData],
        [() => true, renderExpansionPanels],
      ])(undefined)}
    </>
  )
}

export default UpdateRulesTable
