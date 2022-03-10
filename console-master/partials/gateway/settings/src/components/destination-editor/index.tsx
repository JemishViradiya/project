//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box, Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import type { NetworkServiceEntityPartial, TargetSet } from '@ues-data/gateway'
import { Components, Config, Hooks } from '@ues-gateway/shared'

import { TargetSetEditor } from './target-set-editor'
import type { TargetSetEditorProps } from './target-set-editor/types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useNetworkServicesData } = Hooks
const { EntityDetailsViewContext } = Components

interface DestinationEditorData {
  networkServices?: NetworkServiceEntityPartial[]
  targetSet?: TargetSet[]
}

interface DestinationEditorProps extends Pick<TargetSetEditorProps, 'isSystemNetworkService' | 'showConjunctionLabel'> {
  initialData: DestinationEditorData
  networkServiceDescription: string
  targetSetDescription: string
  networkServicesDataFnArgs?: Hooks.NetworkServicesDataFnArgs
  onNetworkServicesChange: (value: DestinationEditorData['networkServices']) => void
  onTargetSetChange: (value: DestinationEditorData['targetSet']) => void
}

export const DestinationEditor: React.FC<DestinationEditorProps> = ({
  initialData,
  networkServiceDescription,
  targetSetDescription,
  networkServicesDataFnArgs,
  isSystemNetworkService,
  onNetworkServicesChange,
  onTargetSetChange,
  showConjunctionLabel,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { id } = useParams()

  const [isTargetSetValid, setIsTargetSetValid] = useState<boolean>(initialData?.targetSet?.length > 0 || !id)
  const previousIsTargetSetValid = usePrevious(isTargetSetValid)

  const { networkServicesSelectOptions, makeNetworkServicesPartials, loading: loadingNetworkServices } = useNetworkServicesData(
    networkServicesDataFnArgs,
  )

  const { initialNetworkServices, initialTargetSet } = useMemo(
    () => ({
      initialNetworkServices: (initialData?.networkServices ?? []).map(item => item.id),
      initialTargetSet: initialData?.targetSet ?? [],
    }),
    [initialData],
  )

  const { updateFormValidationStates, shouldDisableFormField } = useContext(EntityDetailsViewContext)

  useEffect(() => {
    if (isTargetSetValid !== previousIsTargetSetValid) {
      updateFormValidationStates({ isTargetSetValid })
    }
  }, [updateFormValidationStates, isTargetSetValid, previousIsTargetSetValid])

  const destinationComponents = [
    {
      title: t('common.networkServices'),
      description: networkServiceDescription,
      component: (
        <Form
          initialValues={{ networkServices: initialNetworkServices }}
          onChange={({ formValues: { networkServices } }) => onNetworkServicesChange(makeNetworkServicesPartials(networkServices))}
          hideButtons
          fields={[
            {
              type: 'multiSelect',
              name: 'networkServices',
              label: t('common.networkServices'),
              placeholder: t('networkServices.addNetworkServices'),
              options: networkServicesSelectOptions,
              disabled: shouldDisableFormField ?? loadingNetworkServices,
            },
          ]}
        />
      ),
    },
    {
      title: t('networkServices.addressAndPort.title'),
      description: (
        <>
          <Typography>{targetSetDescription}</Typography>
          <ul>
            {[
              'networkServices.addressAndPort.addressRow',
              'networkServices.addressAndPort.portRow',
              'networkServices.addressAndPort.addressPortRow',
            ].map((labelTranslationKey, index) => (
              <li key={index}>
                <Typography>{t(labelTranslationKey)}</Typography>
              </li>
            ))}
          </ul>
        </>
      ),
      component: (
        <TargetSetEditor
          initialData={initialTargetSet}
          isSystemNetworkService={isSystemNetworkService}
          onChange={({ formValues: { targetSet }, isFormValid }) => {
            onTargetSetChange(targetSet)
            setIsTargetSetValid(isFormValid)
          }}
          showConjunctionLabel={showConjunctionLabel}
        />
      ),
    },
  ]

  return (
    <>
      {destinationComponents.map(({ title, component, description }, index) => (
        <Box mb={2} key={index}>
          <Typography variant="subtitle2" color="textPrimary">
            {title}
          </Typography>
          <Box my={2}>{description}</Box>
          <Box mb={4}>{component}</Box>
        </Box>
      ))}
    </>
  )
}
