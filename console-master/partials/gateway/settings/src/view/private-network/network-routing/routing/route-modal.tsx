//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import type { ValidateResult } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { TenantConfiguration } from '@ues-data/gateway'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { Config, Data, Hooks, Utils } from '@ues-gateway/shared'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

const { getLocalTenantConfig, mutationUpdateTenantConfig, updateLocalTenantConfig } = Data
const { getIPType, IPType, isCIDR, isIPRange, isValidIPOrRange, isValidIPsOrRanges } = Utils
const { useStatefulNotifications } = Hooks
const { GATEWAY_TRANSLATIONS_KEY } = Config

export interface RouteModalDialogProps {
  dialogId: symbol
  values?: { ip: string | string[]; id: string }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const RouteModalDialog: React.FC<RouteModalDialogProps> = ({ dialogId, values }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { open, onClose } = useControlledDialog({ dialogId })
  const [updateTenantConfigStartAction] = useStatefulNotifications(useStatefulReduxMutation(mutationUpdateTenantConfig), {
    success: t('connectors.messageSettingsUpdated'),
    error: ({ error }) => error?.message,
  })
  const dispatch = useDispatch()
  const { privateNetworkIpV4Ranges, privateNetworkIpV6Ranges } = useSelector(getLocalTenantConfig)

  const isAddMode = !values

  const addRoutes = (values: string[]): Partial<TenantConfiguration> => {
    const updatedPrivateNetworkIpV4Ranges = privateNetworkIpV4Ranges ? [...privateNetworkIpV4Ranges] : []
    const updatedPrivateNetworkIpV6Ranges = privateNetworkIpV6Ranges ? [...privateNetworkIpV6Ranges] : []

    values.forEach(value => {
      getRecordIpVersion(value) === IPType.IPv4
        ? updatedPrivateNetworkIpV4Ranges.splice(0, 0, value)
        : updatedPrivateNetworkIpV6Ranges.splice(0, 0, value)
    })

    return { privateNetworkIpV4Ranges: updatedPrivateNetworkIpV4Ranges, privateNetworkIpV6Ranges: updatedPrivateNetworkIpV6Ranges }
  }

  const editRoute = ({ id, ip }): Partial<TenantConfiguration> => {
    const [oldVersion, index] = id.split('@@')
    const newVersion = getRecordIpVersion(ip)
    const updatedPrivateNetworkIpV4Ranges = privateNetworkIpV4Ranges ? [...privateNetworkIpV4Ranges] : []
    const updatedPrivateNetworkIpV6Ranges = privateNetworkIpV6Ranges ? [...privateNetworkIpV6Ranges] : []

    if (oldVersion === newVersion) {
      // Update record in the corresponding collection
      newVersion === IPType.IPv4
        ? updatedPrivateNetworkIpV4Ranges.splice(index, 1, ip)
        : updatedPrivateNetworkIpV6Ranges.splice(index, 1, ip)
    } else {
      // Insert new value to the corresponding collection
      newVersion === IPType.IPv4
        ? updatedPrivateNetworkIpV4Ranges.splice(0, 0, ip)
        : updatedPrivateNetworkIpV6Ranges.splice(0, 0, ip)
      // Remove new value from old collection
      oldVersion === IPType.IPv4
        ? updatedPrivateNetworkIpV4Ranges.splice(index, 1)
        : updatedPrivateNetworkIpV6Ranges.splice(index, 1)
    }

    return { privateNetworkIpV4Ranges: updatedPrivateNetworkIpV4Ranges, privateNetworkIpV6Ranges: updatedPrivateNetworkIpV6Ranges }
  }

  const getRecordIpVersion = (ipValue: string): Utils.IPType => {
    if (isIPRange(ipValue)) ipValue = ipValue.split('-')[0]
    else if (isCIDR(ipValue)) ipValue = ipValue.split('/')[0]
    return getIPType(ipValue)
  }

  const makeUpdate = (formData): void => {
    const update = isAddMode ? addRoutes(formData.Route) : editRoute({ id: values?.id, ip: formData.Route })
    dispatch(updateLocalTenantConfig(update))
  }

  const handleSubmit = (formData): void => {
    makeUpdate(formData)
    onClose()
  }

  const validateFn = value => (isAddMode ? isValidIPsOrRanges(value) : isValidIPOrRange(value))

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={isAddMode ? t('privateNetwork.privateNetworkRouteAdd') : t('privateNetwork.privateNetworkRouteEdit')}
        onClose={onClose}
        content={
          <Form
            initialValues={{ Route: values?.ip }}
            fields={[
              {
                type: isAddMode ? 'multiLine' : 'text',
                name: 'Route',
                label: t('privateNetwork.labelRoute'),
                helpLabel: t('privateNetwork.enterAddressesRangesCidrsHelpLabel'),
                validationRules: {
                  required: { value: true, message: t('common.requiredFieldErrorMessage') },
                  validate: value => (!validateFn(value) ? t('privateNetwork.errorInvalidRouteFormat') : true) as ValidateResult,
                },
              },
            ]}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          />
        }
      />
    </Dialog>
  )
}

export default RouteModalDialog
