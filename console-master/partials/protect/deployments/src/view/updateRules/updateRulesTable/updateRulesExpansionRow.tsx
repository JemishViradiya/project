// dependencies
import cond from 'lodash/cond'
import React, { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useTranslation } from 'react-i18next'

// components
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import Autocomplete from '@material-ui/lab/Autocomplete'

import type { UpdateRule } from '@ues-data/epp'
import {
  BasicDelete,
  ChevronDown,
  CylanceGuard,
  CylanceIconZones,
  CylanceOptics,
  CylancePersona,
  CylanceProtect,
} from '@ues/assets'
import { handleHover } from '@ues/behaviours'

import useUpdateRulesTableStyles from './updateRulesTable.styles'

// constants
const PRODUCT_ICONS = {
  Optics: CylanceOptics,
  Protect: CylanceProtect,
  Guard: CylanceGuard,
  Persona: CylancePersona,
}
const CARD_TYPES = {
  RULE: 'RULE',
}

interface UpdateRulesExpansionRowPropTypes {
  index: number
  length: number
  updateRule: UpdateRule
  isEditable: boolean
  onDelete: (item: UpdateRule) => void
  moveCard: (prevIndex: number, newIndex: number) => void
}

const UpdateRulesExpansionRow = ({
  index,
  length,
  updateRule,
  isEditable,
  onDelete,
  moveCard,
}: UpdateRulesExpansionRowPropTypes) => {
  const { t: translate } = useTranslation(['deployments'])
  const classes = useUpdateRulesTableStyles()

  // drag & drop

  const dragDropRef = useRef(null)
  const [dragDropInputValue, setDragDropInputValue] = useState(index + 1)

  const [, drag, preview] = useDrag({
    item: { type: CARD_TYPES.RULE, id: updateRule.id, index },
  })

  const [, drop] = useDrop({
    accept: CARD_TYPES.RULE,
    hover: handleHover(dragDropRef, index, moveCard),
  })

  // actions

  const onChangeRuleIndex = ({ target: { value } }) => setDragDropInputValue(value)

  const onKeyDownRuleIndex = e => {
    const {
      key,
      target: { value },
    } = e

    cond([[() => key === 'Enter' && isIndexInputValid(value), () => moveCard(index, value - 1)]])(undefined)
  }

  const onBlurRuleIndex = ({ target: { value } }) =>
    cond([
      [() => isIndexInputValid(value), () => moveCard(index, value - 1)],
      [() => true, () => setDragDropInputValue(index + 1)],
    ])(undefined)

  const onDeleteItem = e => {
    e.stopPropagation() // prevent click from toggling panel expansion
    onDelete(updateRule)
  }

  // utils

  const isIndexInputValid = value => value && !isNaN(value) && value > 0 && value <= length

  // effects

  useEffect(() => setDragDropInputValue(index + 1), [index])

  // render

  const renderProductIcon = productName => {
    const Icon = PRODUCT_ICONS[productName || 'Optics']
    return <Icon color="action" />
  }

  const renderStaticSummary = () => (
    <Grid container alignItems="center">
      <Grid item xs={2}>
        <Typography variant="subtitle1">{index + 1}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle1">{updateRule.name}</Typography>
      </Grid>
      <Grid item xs={2} container alignItems="center">
        <Box mr={2} display="flex">
          <CylanceIconZones color="action" />
        </Box>
        {updateRule.zones.length}
      </Grid>
      <Grid item xs={5}>
        <Typography variant="body1">{updateRule.strategy}</Typography>
      </Grid>
    </Grid>
  )

  const renderStaticDetails = () => (
    <Grid container spacing={5}>
      <Grid item xs={1}>
        <Typography variant="subtitle1">{translate('Strategy')}</Typography>
      </Grid>
      <Grid item xs={11} container alignItems="center">
        {updateRule.strategy}
      </Grid>
      <Grid item xs={1}>
        <Typography variant="subtitle1">{translate('Products')}</Typography>
      </Grid>
      <Grid item xs={11} container alignItems="center">
        {/* --TODO: get Products from associated strategy */}
        <Box mr={1} display="flex">
          {renderProductIcon('Protect')}
        </Box>
        <Box display="flex">CylancePROTECT</Box>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="subtitle1">{translate('Zones')}</Typography>
      </Grid>
      <Grid item xs={11}>
        <List disablePadding dense>
          {updateRule.zones.map(zone => (
            <ListItem disableGutters key={zone}>
              {zone}
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  )

  const renderEditableSummary = () => (
    <Grid container alignItems="center">
      <Grid item xs={2} container alignItems="center">
        <Box
          component={props => <div {...props} ref={node => drag(drop(node))} />}
          className="dragAndDrop-handle"
          display="flex"
          mr={2}
        >
          <DragIndicatorIcon />
        </Box>
        <TextField
          className="dragAndDrop-input no-label"
          variant="filled"
          margin="dense"
          value={dragDropInputValue}
          size="small"
          type="number"
          inputProps={{
            min: 1,
            max: length,
          }}
          onClick={e => e.stopPropagation()}
          onChange={onChangeRuleIndex}
          onKeyDown={onKeyDownRuleIndex}
          onBlur={onBlurRuleIndex}
        />
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle1">{updateRule.name}</Typography>
      </Grid>
      <Grid item xs={2} container alignItems="center">
        <Box mr={2} display="flex">
          <CylanceIconZones color="action" />
        </Box>
        {updateRule.zones.length}
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body1">{updateRule.strategy}</Typography>
      </Grid>
      <Grid item xs={1} container justifyContent="flex-end">
        <IconButton onClick={onDeleteItem} data-autoid="update-rules-delete">
          <BasicDelete />
        </IconButton>
      </Grid>
    </Grid>
  )

  const renderEditableDetails = () => (
    <Grid container spacing={6}>
      <Grid item container spacing={5}>
        <Grid item xs={6}>
          <TextField fullWidth label={translate('RuleName')} defaultValue={updateRule.name} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label={translate('DescriptionOptional')} defaultValue={updateRule.description} />
        </Grid>
      </Grid>
      <Grid item container spacing={5}>
        <Grid item xs={6}>
          <TextField fullWidth label={translate('UpdateStrategy')} defaultValue={updateRule.strategy} />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            multiple
            options={updateRule.zones}
            defaultValue={updateRule.zones}
            renderInput={params => <TextField {...params} fullWidth label={translate('ZonesOptional')} />}
          />
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <Accordion className={classes.expansionRow} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ChevronDown />}
        data-autoid="update-rules-panel-header"
        ref={node => {
          dragDropRef.current = node
          preview(drop(dragDropRef.current))
        }}
      >
        {cond([
          [() => isEditable, renderEditableSummary],
          [() => true, renderStaticSummary],
        ])(undefined)}
      </AccordionSummary>
      <AccordionDetails data-autoid="update-rules-panel-content">
        {cond([
          [() => isEditable, renderEditableDetails],
          [() => true, renderStaticDetails],
        ])(undefined)}
      </AccordionDetails>
    </Accordion>
  )
}

export default UpdateRulesExpansionRow
