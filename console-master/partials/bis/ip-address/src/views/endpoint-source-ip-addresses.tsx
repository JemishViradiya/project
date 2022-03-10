import React, { memo, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Permission, useFeatures } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { FeatureWrapper, SecuredContent, useFeatureCheck, useSecuredContent } from '@ues/behaviours'

import { IpAddressDialog, useIpAddressDialogHandlers } from '../components/ip-address-dialog'
import IpAddressList from '../components/ip-address-list'
import { useCreationHandler } from '../hooks/use-creation-handler'
import { useDeletionHandler } from '../hooks/use-deletion-handler'
import { useSettingsVariables } from '../hooks/use-settings-variables'
import { useUpdationHandler } from '../hooks/use-updation-handler'
import type { IpAddressEntry } from '../model'

interface EndpointSourceIpAddressesProps {
  isBlacklist: boolean
}

export const EndpointSourceIpAddresses = memo(({ isBlacklist }: EndpointSourceIpAddressesProps) => {
  const { variables } = useSettingsVariables({ isBlacklist })

  const { openDialog, closeDialog, setLoading, dialogProps } = useIpAddressDialogHandlers()

  const onAddButtonClick = () => {
    openDialog()
  }

  const handleClose = () => {
    closeDialog()
  }

  const handleCreation = useCreationHandler(variables)
  const handleUpdation = useUpdationHandler(variables)
  const handleDeletion = useDeletionHandler(variables)

  const handleSubmission = useCallback(
    async (entry: Partial<IpAddressEntry>, previous?: IpAddressEntry) => {
      setLoading(true)

      let result

      if (previous) {
        const { id, ...rest } = previous
        result = await handleUpdation(id, { ...rest, ...entry })
      } else {
        result = await handleCreation({ ...entry, isBlacklist, listType: 'user' })
      }

      if (!result?.error) {
        closeDialog()
      }

      setLoading(false)
    },
    [closeDialog, handleCreation, handleUpdation, isBlacklist, setLoading],
  )

  return (
    <FeatureWrapper featureName={FeatureName.BisIpFenceEnabled}>
      <SecuredContent requiredPermissions={Permission.VENUE_SETTINGSGLOBALLIST_READ}>
        <IpAddressList
          onAddButtonClick={onAddButtonClick}
          onEntryClick={openDialog}
          handleDeletion={handleDeletion}
          variables={variables}
        />

        <IpAddressDialog isBlacklist={isBlacklist} onClose={handleClose} onSubmit={handleSubmission} {...dialogProps} />
      </SecuredContent>
    </FeatureWrapper>
  )
})
