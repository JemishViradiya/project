import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import CachedIcon from '@material-ui/icons/Cached'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

import type { PersonaModel, PersonaModelType } from '@ues-data/persona'
import { PersonaModelCommand, PersonaModelStatus } from '@ues-data/persona'

import { PERSONA_MODEL_TYPES_LIST } from '../../../../constants'
import { ModelCommandButton } from './modelCommandButton'
import useStyle from './personaStatus.styles'

interface PersonaStatusHeaderPropTypes {
  models: PersonaModel[]
  processingModels: Record<string, PersonaModelCommand>
  isModelProcessing: (modelType: PersonaModelType, deviceId: string) => boolean
  isDeviceOffline: boolean
  modelStatusSucceeded: boolean
  isUpdateModelReqPending: (command: PersonaModelCommand, models: PersonaModelType[]) => boolean
  onModelsStatusChange: (models: PersonaModelType[], command: PersonaModelCommand) => (_event) => void
  onModelsStatusReset: (models: PersonaModelType[]) => (_event) => void
}

export const PersonaStatusHeader = ({
  models,
  processingModels,
  isDeviceOffline,
  modelStatusSucceeded,
  isUpdateModelReqPending,
  onModelsStatusChange,
  onModelsStatusReset,
}: PersonaStatusHeaderPropTypes) => {
  const classes = useStyle()
  const { t } = useTranslation(['persona/common'])

  const numberOfPaused = models.filter(model => {
    return model.status === PersonaModelStatus.PAUSED
  }).length
  const numberOfScoring = models.filter(
    model => model.status === PersonaModelStatus.SCORING || model.status === PersonaModelStatus.TRAINING,
  ).length
  const numberOfProcessing = Object.values(processingModels).length

  const isAllPaused = numberOfPaused === models.length
  const isAllScoring = numberOfScoring === models.length
  const isAllProcessing = numberOfProcessing === PERSONA_MODEL_TYPES_LIST.length

  return (
    <ListItem data-autoid="persona-status-item" disableGutters={true} className={classes.headerItem}>
      <Grid container spacing={1} justify="space-between">
        <Grid item xs data-autoid="persona-status-label" alignContent="center">
          <Typography variant="h4">{t('users.sectionTitles.cylancePersonaStatus')}</Typography>
        </Grid>

        {modelStatusSucceeded && (
          <Grid container item xs justify="flex-end">
            <Box>
              <ModelCommandButton
                label={t('personaModelButton.ResumeScoringAll')}
                isDisabled={
                  isUpdateModelReqPending(PersonaModelCommand.RESUME, PERSONA_MODEL_TYPES_LIST) || isAllScoring || isAllProcessing
                }
                isDeviceOffline={isDeviceOffline}
                onClick={onModelsStatusChange(PERSONA_MODEL_TYPES_LIST, PersonaModelCommand.RESUME)}
              >
                <PlayArrowIcon />
              </ModelCommandButton>
            </Box>
            <Box>
              <ModelCommandButton
                label={t('personaModelButton.PauseScoringAll')}
                isDisabled={
                  isUpdateModelReqPending(PersonaModelCommand.PAUSE, PERSONA_MODEL_TYPES_LIST) || isAllPaused || isAllProcessing
                }
                isDeviceOffline={isDeviceOffline}
                onClick={onModelsStatusChange(PERSONA_MODEL_TYPES_LIST, PersonaModelCommand.PAUSE)}
              >
                <PauseIcon />
              </ModelCommandButton>
            </Box>
            <Box>
              <ModelCommandButton
                label={t('personaModelButton.ResetScoringAll')}
                isDisabled={isUpdateModelReqPending(PersonaModelCommand.RESET, PERSONA_MODEL_TYPES_LIST) || isAllProcessing}
                isDeviceOffline={isDeviceOffline}
                onClick={onModelsStatusReset(PERSONA_MODEL_TYPES_LIST)}
              >
                <CachedIcon />
              </ModelCommandButton>
            </Box>
          </Grid>
        )}
      </Grid>
    </ListItem>
  )
}
