//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { uniq } from 'lodash-es'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Dialog, Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { Config, Data, Types } from '@ues-gateway/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import { applicationsValidation, isAddModeFn } from '../../validation'
import EnvironmentPaths from './environment-paths'
import PathExtensionAlert from './path-extension-alert'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data
const { WindowsPerAppVpnItemsType } = Types

export interface WindowsAccessControlDialogProps {
  dialogId: UseControlledDialogProps['dialogId']
  rowData?: Types.DeviceSettingsListItem
  type?: Types.WindowsPerAppVpnItemsType
}

const WindowsAccessControlDialog: React.FC<WindowsAccessControlDialogProps> = ({
  dialogId,
  rowData,
  type = WindowsPerAppVpnItemsType.AppIds,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const dispatch = useDispatch()

  const [formValues, setFormValues] = useState<string[]>([])
  const [isFormValid, setIsFormValid] = useState<boolean>()

  const isAddMode = isAddModeFn(rowData)
  const isPaths = type === WindowsPerAppVpnItemsType.Paths

  const { open, onClose } = useControlledDialog({ dialogId })

  const initializeFormData = () => (isAddMode ? {} : { applications: rowData.value })

  const handleClose = () => {
    setFormValues([])
    onClose()
  }

  const add = (formData): string[] => {
    const currentData = [...(localPolicyData?.platforms?.Windows?.perAppVpn?.[type] ?? [])]
    const applications = formData.applications.map(application => application.trim())

    const update = uniq<string>(applications).filter(item => !currentData.includes(item))

    return [...currentData, ...update]
  }

  const edit = (formData): string[] => {
    const updatedData = [...localPolicyData.platforms?.Windows?.perAppVpn?.[type]]

    updatedData[rowData.indexInParentArray] = formData.applications.trim()

    return updatedData
  }

  const updateWindowsAccessControlData = (formData): void => {
    const update = isAddMode ? add(formData) : edit(formData)

    dispatch(
      updateLocalPolicyData({
        platforms: {
          ...(localPolicyData?.platforms ?? {}),
          Windows: {
            ...(localPolicyData?.platforms?.Windows ?? {}),
            perAppVpn: {
              ...(localPolicyData?.platforms?.Windows?.perAppVpn ?? {}),
              [type]: update,
            },
          },
        },
      }),
    )

    handleClose()
  }

  const makeDialogTitle = () => {
    if (isAddMode) {
      return isPaths ? t('policies.windowsAddPath') : t('policies.windowsAddPFN')
    }

    return isPaths ? t('policies.windowsEditPath') : t('policies.windowsEditPFN')
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'sm'}>
      <DialogChildren
        title={makeDialogTitle()}
        onClose={handleClose}
        content={
          <Form
            fields={[
              {
                type: isAddMode ? 'multiLine' : 'text',
                label: isPaths ? t('policies.path') : t('policies.windowsPFN'),
                helpLabel: isAddMode && isPaths ? t('policies.enterPathHelpLabel') : t('policies.enterWindowsPfnHelpLabel'),
                name: 'applications',
                validationRules: {
                  required: { value: true, message: t('common.requiredFieldErrorMessage') },
                  validate: value => applicationsValidation({ value, isAddMode, localPolicyData, type, rowData, t }),
                },
              },
            ]}
            initialValues={initializeFormData()}
            onChange={({ formValues: { applications } }) =>
              Array.isArray(applications) ? setFormValues(applications) : setFormValues([applications])
            }
            onValidationChange={({ isFormValid }) => setIsFormValid(isFormValid)}
            onSubmit={updateWindowsAccessControlData}
            onCancel={handleClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          >
            {isPaths && (
              <Box mb={6}>
                <Typography variant="body2" gutterBottom>
                  {t('policies.windowsAddPathDescription')}
                </Typography>

                <EnvironmentPaths isAddMode={isAddMode} />

                <Box mt={6}>
                  <PathExtensionAlert paths={formValues} isFormValid={isFormValid} />
                </Box>
              </Box>
            )}
          </Form>
        }
      />
    </Dialog>
  )
}

export default WindowsAccessControlDialog
