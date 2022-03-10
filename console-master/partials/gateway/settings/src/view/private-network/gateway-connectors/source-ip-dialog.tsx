//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import type { ValidateResult } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { TenantConfiguration } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'
import { Config, Data, Utils } from '@ues-gateway/shared'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

const { isValidIPOrRange, isValidIPsOrRanges } = Utils
const { getLocalTenantConfig, updateLocalTenantConfig } = Data
const { GATEWAY_TRANSLATIONS_KEY } = Config

export interface SourceIpDialogProps {
  dialogId: symbol
  rowData?: Types.IpAddressesListItem
}

const SourceIpDialog: React.FC<SourceIpDialogProps> = ({ dialogId, rowData }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { open, onClose } = useControlledDialog({ dialogId })
  const { egressSourceIPRestrictionIPs } = useSelector(getLocalTenantConfig)

  const isAddMode = !rowData

  const addIps = (formData: Types.IpAddressesListItem): TenantConfiguration['egressSourceIPRestrictionIPs'] => {
    return [...(egressSourceIPRestrictionIPs ?? []), ...(formData.ip as string[]).values()]
  }

  const editIp = (formData: Types.IpAddressesListItem): TenantConfiguration['egressSourceIPRestrictionIPs'] => {
    const update = [...(egressSourceIPRestrictionIPs ?? [])]
    update[rowData.id] = formData.ip as string
    return update
  }

  const updateTenantConfig = (formData: Types.IpAddressesListItem): void => {
    const update = isAddMode ? addIps(formData) : editIp(formData)
    dispatch(updateLocalTenantConfig({ egressSourceIPRestrictionIPs: update }))
    onClose()
  }

  const validateFn = value => (isAddMode ? isValidIPsOrRanges(value as string[]) : isValidIPOrRange(value as string))

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={t(isAddMode ? 'common.ipAddressAdd' : 'common.ipAddressEdit')}
        onClose={onClose}
        content={
          <Form
            initialValues={{ ip: rowData?.ip }}
            fields={[
              {
                type: isAddMode ? 'multiLine' : 'text',
                name: 'ip',
                label: t('common.ipAddress'),
                helpLabel: t('privateNetwork.enterAddressesRangesCidrsHelpLabel'),
                validationRules: {
                  required: { value: true, message: t('common.requiredFieldErrorMessage') },
                  validate: value => (!validateFn(value) ? t('connectors.errorInvalidIpAddress') : true) as ValidateResult,
                },
              },
            ]}
            onSubmit={updateTenantConfig}
            onCancel={onClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          />
        }
      />
    </Dialog>
  )
}

export default SourceIpDialog
