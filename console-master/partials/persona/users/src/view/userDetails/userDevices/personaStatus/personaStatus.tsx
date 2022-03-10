import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'

import type { PersonaModelType } from '@ues-data/persona'
import {
  getUpdatePersonaModelTaskKey,
  mutationUpdatePersonaModels,
  PersonaModelCommand,
  queryUserDevicePersonaModels,
  usersSelectors,
} from '@ues-data/persona'
import { useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { ENABLED_PERSONA_MODELS_LIST } from '@ues-persona/shared'
import { ConfirmationState } from '@ues/behaviours'

import { orderModels } from '../devicePanel.utils'
import useStyle from './personaStatus.styles'
import { PersonaStatusHeader } from './personaStatusHeader'
import { PersonaStatusRow } from './personaStatusRow'
import { useResetModelsConfirmation } from './useResetModelConfirmation'

interface PersonaStatusProps {
  userId: string
  deviceId: string
  isDeviceOffline: boolean
}

export const PersonaStatus = React.memo(({ userId, deviceId, isDeviceOffline }: PersonaStatusProps) => {
  const classes = useStyle()
  const { t } = useTranslation(['persona/common'])

  const [processingModels, setProcessingModel] = useState<Record<string, PersonaModelCommand>>({})

  const updatePersonaModelsTasks = useSelector(usersSelectors.getUpdateUserDevicePersonaModelsTask)
  const resetModelsConfirmation = useResetModelsConfirmation()

  const [updatePersonaModelsStartAction] = useStatefulReduxMutation(mutationUpdatePersonaModels)
  const userDeviceModelsVariables = useMemo(() => ({ userId, deviceId }), [deviceId, userId])
  const { data: personaModelsData, loading: personaModelsLoading, error: personaModelsError } = useStatefulReduxQuery(
    queryUserDevicePersonaModels,
    {
      variables: userDeviceModelsVariables,
    },
  )

  const personaModels = personaModelsData?.filter(({ modelType }) => ENABLED_PERSONA_MODELS_LIST.includes(modelType)) ?? []
  const orderedModels = orderModels(personaModels)

  const isGetPersonaModelsSucceeded = personaModels?.length > 0 && !personaModelsLoading

  const changeProcessingModelStatus = useCallback((models: string[], command: PersonaModelCommand) => {
    const modelsCommandMap = models.reduce((acc, model) => ({ ...acc, [model]: command }), {})
    setProcessingModel(curentProcessingModels => ({
      ...curentProcessingModels,
      ...modelsCommandMap,
    }))
  }, [])

  const isModelProcessing = useCallback(
    (modelType: PersonaModelType) => {
      return Object.keys(processingModels).includes(modelType)
    },
    [processingModels],
  )

  const isUpdateModelReqPending = useCallback(
    (command: PersonaModelCommand, models: PersonaModelType[]): boolean => {
      const singleRequestKey = getUpdatePersonaModelTaskKey({ command, deviceId, models })
      const bulkRequestKey = `${deviceId}:${command}`

      const requestTask = updatePersonaModelsTasks[singleRequestKey] ?? updatePersonaModelsTasks[bulkRequestKey] ?? {}

      return requestTask.loading
    },
    [deviceId, updatePersonaModelsTasks],
  )

  const handleModelsStatusChange = useCallback(
    (models: PersonaModelType[], command: PersonaModelCommand) => _event => {
      changeProcessingModelStatus(models, command)
      updatePersonaModelsStartAction({
        userId,
        deviceId,
        command,
        models,
      })
    },
    [changeProcessingModelStatus, deviceId, updatePersonaModelsStartAction, userId],
  )

  const handleModelsReset = useCallback(
    (models: PersonaModelType[]) => async _event => {
      const confirmationState = await resetModelsConfirmation()

      if (confirmationState === ConfirmationState.Confirmed) {
        handleModelsStatusChange(models, PersonaModelCommand.RESET)(_event)
      }
    },
    [resetModelsConfirmation, handleModelsStatusChange],
  )

  return (
    <List>
      <PersonaStatusHeader
        models={orderedModels}
        processingModels={processingModels}
        isModelProcessing={isModelProcessing}
        isDeviceOffline={isDeviceOffline}
        modelStatusSucceeded={isGetPersonaModelsSucceeded}
        isUpdateModelReqPending={isUpdateModelReqPending}
        onModelsStatusChange={handleModelsStatusChange}
        onModelsStatusReset={handleModelsReset}
      />

      {personaModelsError && (
        <Box alignItems="center" justifyContent="start" flexDirection="column" display="flex" className={classes.boxPaddingTop}>
          <Typography variant="body2">{t('users.notifications.dataUnavailableError')}</Typography>
        </Box>
      )}

      {isGetPersonaModelsSucceeded &&
        orderedModels.map((model, index) => (
          <PersonaStatusRow
            key={model.id}
            model={model}
            isDeviceOffline={isDeviceOffline}
            isProcessing={isModelProcessing(model.modelType)}
            isLastItem={orderedModels.length === index}
            isUpdateModelReqPending={isUpdateModelReqPending}
            onModelsStatusChange={handleModelsStatusChange}
            onModelsStatusReset={handleModelsReset}
          />
        ))}
    </List>
  )
})
