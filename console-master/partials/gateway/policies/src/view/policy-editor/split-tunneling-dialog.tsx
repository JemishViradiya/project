//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { uniq } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { Policy } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'
import { Config, Data } from '@ues-gateway/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import { formValidators, isAddModeFn } from './validation'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data

export interface SplitTunnelingDialogProps {
  dialogId: UseControlledDialogProps['dialogId']
  rowData?: Types.PolicyEditorListItem
}

const SplitTunnelingDialog: React.FC<SplitTunnelingDialogProps> = ({ dialogId, rowData }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const dispatch = useDispatch()

  const isAddMode = isAddModeFn(rowData)

  const initializeFormData = () => (isAddMode ? {} : { splitIpRanges: rowData.value })

  const addCIDRs = (formData): Policy['splitIpRanges'] => {
    const currentData = localPolicyData?.splitIpRanges ?? []
    const update = uniq<string>(formData.splitIpRanges).filter(item => !currentData.includes(item))
    return [...currentData, ...update]
  }

  const editCIDR = (formData): Policy['splitIpRanges'] => {
    const updatedData = [...localPolicyData?.splitIpRanges]
    updatedData[rowData.indexInParentArray] = formData.splitIpRanges
    return updatedData
  }

  const updateSplitTunnelingData = formData => {
    const update = isAddMode ? addCIDRs(formData) : editCIDR(formData)
    dispatch(updateLocalPolicyData({ splitIpRanges: update }))
    onClose()
  }

  const { open, onClose } = useControlledDialog({ dialogId })

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogChildren
        title={t(isAddMode ? 'policies.addSplitTunnelingDialogTitle' : 'policies.editSplitTunnelingDialogTitle')}
        onClose={onClose}
        content={
          <Form
            fields={[
              {
                ...(isAddMode
                  ? {
                      type: 'multiLine',
                      helpLabel: t('policies.splitIpRangesFieldHelp'),
                    }
                  : { type: 'text' }),
                label: t('policies.cidrAddresses'),
                name: 'splitIpRanges',
                validationRules: {
                  required: { value: true, message: t('common.requiredFieldErrorMessage') },
                  validate: value =>
                    formValidators({
                      dataKey: 'splitIpRanges',
                      localPolicyData,
                      maybeValues: isAddMode ? (value as string[]) : (value as string),
                      rowData,
                      t,
                    }),
                },
              },
            ]}
            initialValues={initializeFormData()}
            onSubmit={updateSplitTunnelingData}
            onCancel={onClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          />
        }
      />
    </Dialog>
  )
}

export default SplitTunnelingDialog
