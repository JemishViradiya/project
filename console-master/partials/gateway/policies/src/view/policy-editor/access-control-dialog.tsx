//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { uniq } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import type { FormFieldInterface } from '@ues-behaviour/hook-form'
import { Form, FormFieldType } from '@ues-behaviour/hook-form'
import type { AccessControlBlock } from '@ues-data/gateway'
import { AccessControlBlockType, AccessControlType } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'
import { Config, Data, Hooks } from '@ues-gateway/shared'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import { formValidators, isAddModeFn, isTypeOfIPsOrFQDNs } from './validation'

const { GATEWAY_TRANSLATIONS_KEY, NETWORK_ACCESS_RULE_LOCALIZATION_TITLE_KEY } = Config
const { getLocalPolicyData, updateLocalPolicyData } = Data
const { useNetworkServicesData } = Hooks

export const DIALOG_ADD_MODE_LOCALIZATION_TITLE_KEY = {
  [AccessControlType.Allowed]: 'policies.allowedNetworkConnectionsAdd',
  [AccessControlType.Blocked]: 'policies.blockedNetworkConnectionsAdd',
}

export const DIALOG_EDIT_MODE_LOCALIZATION_TITLE_KEY = {
  [AccessControlType.Allowed]: 'policies.allowedNetworkConnectionsEdit',
  [AccessControlType.Blocked]: 'policies.blockedNetworkConnectionsEdit',
}

export const FIELD_LABELS_LOCALIZATION_KEYS = {
  [AccessControlBlockType.Fqdns]: {
    helpLabel: 'networkServices.labelEnterFqdns',
    label: 'common.labelFqdns',
  },
  [AccessControlBlockType.IpRanges]: {
    helpLabel: 'networkServices.labelEnterIPAddressesRangesCidrs',
    label: 'common.labelIpAddressesRangesCidrs',
  },
}

export interface AccessControlDialogProps {
  dialogId: UseControlledDialogProps['dialogId']
  rowData?: Types.AccessControlListItem
  accessControlType: AccessControlType
  accessControlBlockType: AccessControlBlockType
}

const AccessControlDialog: React.FC<AccessControlDialogProps> = ({
  dialogId,
  rowData,
  accessControlType,
  accessControlBlockType,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localPolicyData = useSelector(getLocalPolicyData)
  const dispatch = useDispatch()

  const { makeNetworkServicesPartials, networkServicesSelectOptions, networkServicesMap } = useNetworkServicesData({
    addedNetworkServices: localPolicyData?.[accessControlType]?.networkServices,
    activeNetworkServiceId: rowData?.value,
    aclNetworkServices: false,
  })

  const isAddMode = isAddModeFn(rowData)

  const initializeFormData = () => (isAddMode ? {} : { [rowData.type]: rowData.value })

  const addNetworkServices = (formData): AccessControlBlock['networkServices'] => {
    const update = makeNetworkServicesPartials(formData.networkServices, false)

    return [...(localPolicyData?.[accessControlType]?.networkServices ?? []), ...update]
  }

  const editNetworkService = (formData): AccessControlBlock['networkServices'] => {
    const updatedNetworkServices = [...localPolicyData?.[accessControlType]?.networkServices]
    const currentIndex = updatedNetworkServices.findIndex(item => item.id === rowData.value)

    updatedNetworkServices[currentIndex] = {
      id: formData.networkServices,
      name: networkServicesMap[formData.networkServices].name,
    }

    return updatedNetworkServices
  }

  const addIPsOrFQDNs = (formData): AccessControlBlock['ipRanges'] | AccessControlBlock['fqdns'] => {
    const currentData = (localPolicyData?.[accessControlType]?.[accessControlBlockType] ?? []) as string[]
    const update = uniq<string>(formData[accessControlBlockType]).filter(item => !currentData.includes(item))

    return [...currentData, ...update]
  }

  const editIPOrFQDN = (formData): AccessControlBlock['ipRanges'] | AccessControlBlock['fqdns'] => {
    const updatedData = [...localPolicyData?.[accessControlType]?.[accessControlBlockType]]

    updatedData[rowData.indexInParentArray] = formData[accessControlBlockType]

    return updatedData as string[]
  }

  const makeUpdate = (
    formData,
  ): AccessControlBlock['networkServices'] | AccessControlBlock['ipRanges'] | AccessControlBlock['fqdns'] => {
    if (AccessControlBlockType.NetworkServices === accessControlBlockType) {
      return isAddMode ? addNetworkServices(formData) : editNetworkService(formData)
    }

    if (isTypeOfIPsOrFQDNs(accessControlBlockType)) {
      return isAddMode ? addIPsOrFQDNs(formData) : editIPOrFQDN(formData)
    }
  }

  const updateAccessControlData = (formData): void => {
    const update = makeUpdate(formData)

    dispatch(
      updateLocalPolicyData({
        [accessControlType]: {
          ...(localPolicyData?.[accessControlType] ?? {}),
          [accessControlBlockType]: update,
        },
      }),
    )

    onClose()
  }

  const { open, onClose } = useControlledDialog({ dialogId })

  const makeFormConfig = (): {
    field: FormFieldInterface
  } => {
    if (isTypeOfIPsOrFQDNs(accessControlBlockType)) {
      return {
        field: {
          ...(isAddMode
            ? {
                type: FormFieldType.MultiLine,
                helpLabel: t(FIELD_LABELS_LOCALIZATION_KEYS[accessControlBlockType].helpLabel),
              }
            : { type: 'text' }),
          label: t(FIELD_LABELS_LOCALIZATION_KEYS[accessControlBlockType].label),
          name: accessControlBlockType,
          validationRules: {
            required: { value: true, message: t('policies.networkServiceValidationMessage') },
            validate: value =>
              formValidators({
                dataKey: accessControlBlockType,
                localPolicyData,
                rowData,
                maybeValues: isAddMode ? (value as string[]) : (value as string),
                t,
              }),
          },
        },
      }
    }

    if (AccessControlBlockType.NetworkServices === accessControlBlockType) {
      return {
        field: {
          type: isAddMode ? 'multiSelect' : 'select',
          label: t(NETWORK_ACCESS_RULE_LOCALIZATION_TITLE_KEY[accessControlType]),
          name: AccessControlBlockType.NetworkServices,
          options: networkServicesSelectOptions,
          validationRules: {
            required: { value: true, message: t('policies.networkServiceValidationMessage') },
          },
        },
      }
    }
  }

  const formConfig = makeFormConfig()

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogChildren
        title={t(
          isAddMode
            ? DIALOG_ADD_MODE_LOCALIZATION_TITLE_KEY[accessControlType]
            : DIALOG_EDIT_MODE_LOCALIZATION_TITLE_KEY[accessControlType],
        )}
        description={
          AccessControlBlockType.Fqdns === accessControlBlockType ? t('policies.blockedNetworkConnectionsDescription') : null
        }
        onClose={onClose}
        content={
          <Form
            fields={[formConfig?.field]}
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

export default AccessControlDialog
