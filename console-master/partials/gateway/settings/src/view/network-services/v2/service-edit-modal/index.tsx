//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { BAD_REQUEST } from 'http-status-codes'
import { isEmpty } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { NetworkServicesV2 } from '@ues-data/gateway'
import { RequestError } from '@ues-data/gateway'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { Config, Data, Hooks, Utils } from '@ues-gateway/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, ProgressButton, useControlledDialog } from '@ues/behaviours'

import useStyles from './styles'

const {
  NetworkServicesV2: { mutationCreateNetworkService, mutationUpdateNetworkService },
} = Data
const { isTaskResolved, isValidDomainsAndFQDNs, isValidIPsOrRanges } = Utils
const { useStatefulNotifications } = Hooks
const { GATEWAY_TRANSLATIONS_KEY } = Config

interface ServiceEditModalProps {
  initialValues: Partial<NetworkServicesV2.NetworkServiceEntity>
  onClose: () => void
  dialogId: UseControlledDialogProps['dialogId']
}

const MIN_NAME_FIELD_LENGTH = 3

const ServiceEditModal: React.FC<ServiceEditModalProps> = ({ onClose: closeHandler, initialValues, dialogId }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()

  const makeErrorMessage = ({ error }) => {
    if (error?.response?.status === BAD_REQUEST && error?.response?.data?.error === RequestError.NameAlreadyUsed) {
      return t('networkServices.nameAlreadyUsedError')
    } else {
      return error?.message
    }
  }

  const [createNetworkServiceStartAction, createNetworkServiceTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationCreateNetworkService),
    {
      success: t('networkServices.createNetworkServiceSuccessMessage'),
      error: makeErrorMessage,
    },
  )
  const previousCreateNetworkServiceTask = usePrevious(createNetworkServiceTask)

  const [updateNetworkServiceStartAction, updateNetworkServiceTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationUpdateNetworkService),
    {
      success: t('networkServices.updateNetworkServiceSuccessMessage'),
      error: makeErrorMessage,
    },
  )
  const previousUpdateNetworkServiceTask = usePrevious(updateNetworkServiceTask)

  const { open, onClose } = useControlledDialog({
    dialogId,
    onClose: closeHandler,
  })

  useEffect(() => {
    if (
      isTaskResolved(createNetworkServiceTask, previousCreateNetworkServiceTask) ||
      isTaskResolved(updateNetworkServiceTask, previousUpdateNetworkServiceTask)
    ) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createNetworkServiceTask, updateNetworkServiceTask])

  const isAddMode = isEmpty(initialValues)

  function onSubmit() {
    if (!isAddMode) {
      return updateNetworkServiceStartAction({
        networkServiceId: initialValues.id,
        networkServiceConfig: formData,
      })
    }

    createNetworkServiceStartAction({
      networkServiceConfig: formData,
    })
  }

  const [isFormValid, setIsFormValid] = useState<boolean>()
  const [formData, setFormData] = useState<any>({})

  const isTaskLoading = createNetworkServiceTask?.loading || updateNetworkServiceTask?.loading

  const shouldDisableActionButton =
    isTaskLoading || !isFormValid || (isEmpty(formData?.fqdns?.join()) && isEmpty(formData?.ipRanges?.join()))

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={isAddMode ? t('networkServices.labelAddNetworkService') : t('networkServices.labelEditNetworkService')}
        description={t('networkServices.addNetworkServiceText')}
        onClose={onClose}
        content={
          <>
            <Form
              initialValues={!isAddMode ? initialValues : { ipRanges: [], fqdns: [] }}
              hideButtons
              onValidationChange={({ isFormValid }) => setIsFormValid(isFormValid)}
              onChange={({ formValues }) => setFormData(formValues)}
              fields={[
                {
                  required: true,
                  type: 'text',
                  name: 'name',
                  label: t('common.name'),
                  validationRules: {
                    required: { value: true, message: t('common.requiredFieldErrorMessage') },
                    minLength: {
                      value: MIN_NAME_FIELD_LENGTH,
                      message: t('common.nameFieldMinLengthValidationMessage', { value: MIN_NAME_FIELD_LENGTH }),
                    },
                  },
                },
                {
                  type: 'multiLine',
                  name: 'fqdns',
                  label: t('common.labelFqdns'),
                  helpLabel: t('networkServices.labelEnterFqdns'),
                  validationRules: {
                    validate: (values: string[]) => {
                      if (!isEmpty(values?.join()) && !isValidDomainsAndFQDNs(values)) {
                        return t('networkServices.fqdnsValidationMessage') as string
                      }

                      return true
                    },
                  },
                },
                {
                  type: 'multiLine',
                  name: 'ipRanges',
                  label: t('common.labelIpAddressesRangesCidrs'),
                  helpLabel: t('networkServices.labelEnterIPAddressesRangesCidrs'),
                  validationRules: {
                    validate: (values: string[]) => {
                      if (!isEmpty(values?.join()) && !isValidIPsOrRanges(values)) {
                        return t('networkServices.ipRangesValidationMessage') as string
                      }

                      return true
                    },
                  },
                },
              ]}
            />
            <div className={classes.formButtons}>
              <Button variant="outlined" onClick={onClose} disabled={isTaskLoading}>
                {t('common.buttonCancel')}
              </Button>
              <ProgressButton
                type="submit"
                color="primary"
                variant="contained"
                loading={isTaskLoading}
                disabled={shouldDisableActionButton}
                onClick={onSubmit}
              >
                {isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
              </ProgressButton>
            </div>
          </>
        }
      />
    </Dialog>
  )
}

export default ServiceEditModal
