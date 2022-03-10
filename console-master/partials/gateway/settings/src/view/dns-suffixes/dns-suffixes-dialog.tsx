//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { TenantConfiguration } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'
import { Config, Data } from '@ues-gateway/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

const { getLocalTenantConfig, updateLocalTenantConfig } = Data
const { GATEWAY_TRANSLATIONS_KEY } = Config

export interface DnsSuffixesDialogProps {
  dialogId: UseControlledDialogProps['dialogId']
  rowData?: Types.DnsSuffixesListItem
  rowDataIndex?: number
}

const DnsSuffixesDialog: React.FC<DnsSuffixesDialogProps> = ({ dialogId, rowData, rowDataIndex }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const localTenantConfig = useSelector(getLocalTenantConfig)

  const isAddMode = rowData === undefined

  const addDnsSuffix = (formData): TenantConfiguration['dnsSuffix'] => [...(localTenantConfig?.dnsSuffix ?? []), formData.name]

  const editDnsSuffix = (formData): TenantConfiguration['dnsSuffix'] => {
    const update = [...(localTenantConfig?.dnsSuffix ?? [])]
    update[rowDataIndex] = formData.name
    return update
  }

  const updateTenantConfig = (formData): void => {
    const update = isAddMode ? addDnsSuffix(formData) : editDnsSuffix(formData)
    dispatch(updateLocalTenantConfig({ dnsSuffix: update }))
    onClose()
  }

  const { open, onClose } = useControlledDialog({ dialogId })

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={t(isAddMode ? 'dns.dnsSuffixAdd' : 'dns.dnsSuffixEdit')}
        onClose={onClose}
        content={
          <Form
            fields={[
              {
                type: 'text',
                name: 'name',
                label: t('dns.dnsSuffixFieldNameLabel'),
                validationRules: {
                  required: {
                    value: true,
                    message: t('dns.dnsSuffixFieldNameValidation'),
                  },
                },
              },
            ]}
            initialValues={{ name: rowData?.name }}
            onSubmit={updateTenantConfig}
            onCancel={onClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          />
        }
      />
    </Dialog>
  )
}

export default DnsSuffixesDialog
