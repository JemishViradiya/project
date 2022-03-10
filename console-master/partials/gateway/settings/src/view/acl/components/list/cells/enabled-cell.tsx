//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Switch } from '@material-ui/core'

import { useStatefulReduxMutation } from '@ues-data/shared'
import { Config, Data, Hooks } from '@ues-gateway/shared'

import type { CommonCellProps } from '../../../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useStatefulNotifications, useBigPermissions, BigService } = Hooks
const { mutationUpdateAclRule } = Data

export const EnabledTriggerCell: React.FC<CommonCellProps> = ({ item, disabled }) => {
  const { canUpdate } = useBigPermissions(BigService.Acl)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const [updateAclRuleStart, updateAclRuleTask] = useStatefulNotifications(useStatefulReduxMutation(mutationUpdateAclRule), {
    success: t('acl.updateAclRuleSuccessMessage'),
    error: t('acl.updateAclRuleErrorMessage'),
  })

  return (
    <Switch
      checked={item.enabled}
      color="secondary"
      disabled={disabled || updateAclRuleTask?.loading || !canUpdate}
      onChange={() => updateAclRuleStart({ id: item.id, data: { ...item, enabled: !item.enabled } })}
    />
  )
}

export default EnabledTriggerCell
