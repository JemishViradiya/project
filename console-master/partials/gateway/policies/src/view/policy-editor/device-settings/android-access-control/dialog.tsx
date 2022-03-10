//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { uniq } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { Types } from '@ues-gateway/shared'
import { Config, Data } from '@ues-gateway/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import { applicationIdsValidation, isAddModeFn } from '../../validation'

export interface AndroidAccessControlDialogProps {
  dialogId: UseControlledDialogProps['dialogId']
  rowData?: Types.PolicyEditorListItem
}

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data

const AndroidAccessControlDialog: React.FC<AndroidAccessControlDialogProps> = ({ dialogId, rowData }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const dispatch = useDispatch()

  const isAddMode = isAddModeFn(rowData)

  const initializeFormData = () => (isAddMode ? {} : { appIds: rowData.value })

  const addAppIds = (formData): string[] => {
    const currentData = [...(localPolicyData?.platforms?.Android?.perAppVpn?.appIds ?? [])]

    const update = uniq<string>(formData.appIds).filter(item => !currentData.includes(item))

    return [...currentData, ...update]
  }

  const editAppIds = (formData): string[] => {
    const updatedData = [...localPolicyData.platforms?.Android?.perAppVpn?.appIds]

    updatedData[rowData.indexInParentArray] = formData.appIds

    return updatedData
  }

  const updateAccessControlData = (formData): void => {
    const update = isAddMode ? addAppIds(formData) : editAppIds(formData)

    dispatch(
      updateLocalPolicyData({
        platforms: {
          ...(localPolicyData?.platforms ?? {}),
          Android: {
            ...(localPolicyData?.platforms?.Android ?? {}),
            perAppVpn: {
              ...(localPolicyData?.platforms?.Android?.perAppVpn ?? {}),
              appIds: update,
            },
          },
        },
      }),
    )

    onClose()
  }

  const { open, onClose } = useControlledDialog({
    dialogId,
  })

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogChildren
        title={t(isAddMode ? 'policies.addApplicationId' : 'policies.editApplicationId')}
        onClose={onClose}
        content={
          <Form
            fields={[
              {
                type: isAddMode ? 'multiLine' : 'text',
                label: t('common.applicationIds'),
                helpLabel: isAddMode && t('policies.enterAppIdHelpLabel'),
                name: 'appIds',
                validationRules: {
                  required: { value: true, message: t('common.requiredFieldErrorMessage') },
                  validate: value => applicationIdsValidation(value, isAddMode, localPolicyData, rowData, t),
                },
              },
            ]}
            initialValues={initializeFormData()}
            onSubmit={updateAccessControlData}
            onCancel={onClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          />
        }
      />
    </Dialog>
  )
}

export default AndroidAccessControlDialog
