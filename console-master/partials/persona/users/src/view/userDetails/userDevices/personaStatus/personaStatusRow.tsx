import isEqual from 'lodash-es/isEqual'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import CachedIcon from '@material-ui/icons/Cached'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'

import type { PersonaModel, PersonaModelType } from '@ues-data/persona'
import { PersonaModelCommand, PersonaModelStatus } from '@ues-data/persona'

import { PERSONA_MODEL_STATUS_I18N_MAP, PERSONA_MODEL_TYPE_I18N_MAP } from '../../../../constants'
import { ModelCommandButton } from './modelCommandButton'
import useStyle from './personaStatus.styles'

const isScoring = (status: PersonaModelStatus): boolean =>
  [PersonaModelStatus.SCORING, PersonaModelStatus.TRAINING].includes(status)

interface PersonaStatusRowProps {
  model: PersonaModel
  isLastItem: boolean
  isDeviceOffline: boolean
  isProcessing: boolean
  isUpdateModelReqPending: (command: PersonaModelCommand, models: PersonaModelType[]) => boolean
  onModelsStatusChange: (models: PersonaModelType[], command: PersonaModelCommand) => (_event) => void
  onModelsStatusReset: (models: PersonaModelType[]) => (_event) => void
}

export const PersonaStatusRow: React.FC<PersonaStatusRowProps> = ({
  model,
  isLastItem,
  isDeviceOffline,
  isProcessing,
  isUpdateModelReqPending,
  onModelsStatusChange,
  onModelsStatusReset,
}: PersonaStatusRowProps) => {
  const classes = useStyle()
  const { t } = useTranslation(['persona/common'])

  const renderModelStatusIcon = (modelStatus: PersonaModelStatus) => {
    let iconClassName = null

    switch (modelStatus) {
      case PersonaModelStatus.TRAINING:
        return (
          <RadioButtonUnchecked
            className={classes.training}
            style={{
              marginLeft: '2px',
              alignItems: 'center',
              fontSize: '16px',
            }}
          />
        )
      case PersonaModelStatus.SCORING:
        iconClassName = classes.scoring
        break
      case PersonaModelStatus.PAUSED:
        iconClassName = classes.paused
        break
    }

    return <FiberManualRecordIcon className={iconClassName} fontSize="small" />
  }

  const renderStatusColumn = () =>
    isProcessing ? (
      <Typography variant="body2" data-autoid="persona-status-value">
        {'...'}
        {t('personaModelStatus.Processing')}
      </Typography>
    ) : (
      <>
        <Box mr={2} alignItems="center" display="flex">
          {renderModelStatusIcon(model.status)}
        </Box>
        <Typography variant="body2" data-autoid="persona-status-value">
          {t(PERSONA_MODEL_STATUS_I18N_MAP[model.status])}
        </Typography>
      </>
    )

  const renderActionsColumn = () => (
    <>
      <Box>
        <ModelCommandButton
          label={t('personaModelButton.ResumeScoring')}
          isDisabled={
            isUpdateModelReqPending(PersonaModelCommand.RESUME, [model.modelType]) || isScoring(model.status) || isProcessing
          }
          isDeviceOffline={isDeviceOffline}
          onClick={onModelsStatusChange([model.modelType], PersonaModelCommand.RESUME)}
        >
          <PlayArrowIcon />
        </ModelCommandButton>
      </Box>
      <Box>
        <ModelCommandButton
          label={t('personaModelButton.PauseScoring')}
          isDisabled={
            isUpdateModelReqPending(PersonaModelCommand.PAUSE, [model.modelType]) ||
            isEqual(model.status, PersonaModelStatus.PAUSED) ||
            isProcessing
          }
          isDeviceOffline={isDeviceOffline}
          onClick={onModelsStatusChange([model.modelType], PersonaModelCommand.PAUSE)}
        >
          <PauseIcon />
        </ModelCommandButton>
      </Box>
      <Box>
        <ModelCommandButton
          label={t('personaModelButton.ResetScoring')}
          isDisabled={isUpdateModelReqPending(PersonaModelCommand.RESET, [model.modelType]) || isProcessing}
          isDeviceOffline={isDeviceOffline}
          onClick={onModelsStatusReset([model.modelType])}
        >
          <CachedIcon />
        </ModelCommandButton>
      </Box>
    </>
  )

  return (
    <ListItem disableGutters={true} divider={!isLastItem}>
      <Grid container spacing={1} justify="space-between">
        <Grid container item xs data-autoid="persona-status-label" alignItems="center">
          <Typography variant="body2">{t(PERSONA_MODEL_TYPE_I18N_MAP[model.modelType])}</Typography>
        </Grid>

        <Grid container item xs className={classes.midCol} alignItems="center">
          {renderStatusColumn()}
        </Grid>

        <Grid container item xs justify="flex-end">
          {renderActionsColumn()}
        </Grid>
      </Grid>
    </ListItem>
  )
}
