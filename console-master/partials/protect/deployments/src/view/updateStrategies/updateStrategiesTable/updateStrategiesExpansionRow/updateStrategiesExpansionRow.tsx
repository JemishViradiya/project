// dependencies
import cond from 'lodash/cond'
import type { MouseEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormState } from 'react-use-form-state'

// components
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'

import type { StrategiesListItem } from '@ues-data/epp'
import { mutateUpdateStrategy } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { ChevronDown as ChevronDownIcon } from '@ues/assets'
import { useSnackbar } from '@ues/behaviours'

// utils
import useUpdateStrategiesTableStyles from './../updateStrategiesTable.styles'
import { EditableExpansionPanelDetails, EditableExpansionPanelSummary } from './editableUpdateStrategiesExpansionRow'
import { StaticExpansionPanelDetails, StaticExpansionPanelSummary } from './staticUpdateStrategiesExpansionRow'

interface UpdateStrategiesExpansionRowPropTypes {
  updateStrategy: StrategiesListItem
}

const UpdateStrategiesExpansionRow = ({ updateStrategy }: UpdateStrategiesExpansionRowPropTypes) => {
  const { t: translate } = useTranslation(['deployments'])
  const classes = useUpdateStrategiesTableStyles()
  const { enqueueMessage } = useSnackbar()

  // state

  const [isOpen, setIsOpen] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [proceed, setProceed] = useState(false)

  const [formState, { text: textProps }] = useFormState<StrategiesListItem>(updateStrategy)

  // dispatch
  const {
    error: errorMutateUpdateStrategy,
    loading: loadingMutateUpdateStrategy,
    refetch: refetchMutateUpdateStrategy,
  } = useStatefulReduxQuery(mutateUpdateStrategy, { skip: true, noDataExpected: true })

  const dispatchEditUpdateStrategy = values => {
    refetchMutateUpdateStrategy(values)
  }

  // actions

  const onOpenChanged = useCallback(() => setIsOpen(isOpen => !isOpen), [])

  const onToggleEdit = useCallback(
    (e: MouseEvent) => {
      // stop the click event propagation if the panel is open,
      // otherwise the panel is closed and we want the edit
      // button click event to propagate and open the panel
      if (isOpen) {
        e.stopPropagation()
      }

      setIsEditable(isEditable => !isEditable)
    },
    [isOpen],
  )

  const onCancelEdit = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      setIsEditable(isEditable => !isEditable)
      formState.reset()
    },
    [formState],
  )

  const onSaveEdit = (e: MouseEvent) => {
    e.stopPropagation()
    setProceed(true)
    dispatchEditUpdateStrategy(formState.values)
  }

  const onDelete = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      // --TODO
      console.log(updateStrategy)
    },
    [updateStrategy],
  )

  const onInternalError = useCallback(() => {
    setProceed(false)
    enqueueMessage(translate('UpdateStrategyEditError'), 'error')
  }, [enqueueMessage, translate])

  const onSuccess = useCallback(() => {
    enqueueMessage(translate('UpdateStrategyEditSuccess'), 'success')
    setIsEditable(false)
    setProceed(false)
  }, [enqueueMessage, translate])

  useEffect(
    () =>
      cond([
        [() => proceed && Boolean(errorMutateUpdateStrategy), onInternalError],
        [() => proceed && !loadingMutateUpdateStrategy, onSuccess],
      ])(undefined),
    [errorMutateUpdateStrategy, proceed, loadingMutateUpdateStrategy, onInternalError, onSuccess],
  )

  // render

  return (
    <Accordion className={classes.expansionRow} TransitionProps={{ unmountOnExit: true }} onChange={onOpenChanged}>
      <AccordionSummary expandIcon={<ChevronDownIcon />} data-autoid="update-strategies-expansion-summary">
        {cond([
          [
            () => isEditable,
            () => (
              <EditableExpansionPanelSummary
                values={formState.values}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                isSubmitting={loadingMutateUpdateStrategy}
              />
            ),
          ],
          [
            () => true,
            () => <StaticExpansionPanelSummary values={formState.values} onToggleEdit={onToggleEdit} onDelete={onDelete} />,
          ],
        ])(undefined)}
      </AccordionSummary>
      <AccordionDetails data-autoid="update-strategies-expansion-details">
        {cond([
          [
            () => isEditable,
            () => <EditableExpansionPanelDetails values={formState.values} setField={formState.setField} textProps={textProps} />,
          ],
          [() => true, () => <StaticExpansionPanelDetails values={formState.values} />],
        ])(undefined)}
      </AccordionDetails>
    </Accordion>
  )
}

export default UpdateStrategiesExpansionRow
