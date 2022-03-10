//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useStatefulReduxMutation } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'
import { BasicMoreHoriz } from '@ues/assets'

import { useAclRouteDetails } from '../../../hooks'
import type { CommonCellProps } from '../../../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { Dropdown } = Components
const { makePageRoute } = Utils
const { useStatefulNotifications, useBigPermissions, BigService } = Hooks
const { mutationDeleteAclRule } = Data
const { Page } = Types

export const ActionsCell: React.FC<CommonCellProps> = ({ item, disabled, hidden }) => {
  const { canDelete, canCreate } = useBigPermissions(BigService.Acl)

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigate = useNavigate()
  const { rulesType } = useAclRouteDetails()

  const [deleteAclRuleStart, deleteAclRuleStartTask] = useStatefulNotifications(useStatefulReduxMutation(mutationDeleteAclRule), {
    success: t('acl.deleteAclRuleSuccessMessage'),
    error: t('acl.deleteAclRuleErrorMessage'),
  })

  const goToAddRule = (expectedRank: number) =>
    navigate(makePageRoute(Page.GatewaySettingsAclAdd, { params: { rulesType }, queryStringParams: { rank: expectedRank } }))

  const goToCopyRule = (expectedRank: number) =>
    navigate(
      makePageRoute(Page.GatewaySettingsAclCopy, { params: { id: item.id, rulesType }, queryStringParams: { rank: expectedRank } }),
    )

  const shouldDisableButton = disabled || deleteAclRuleStartTask?.loading

  return (
    !hidden && (
      <Dropdown
        buttonIcon={<BasicMoreHoriz />}
        disabled={disabled}
        itemGroups={[
          {
            items: [
              {
                hidden: !canCreate,
                label: t('acl.labelAddRuleAbove'),
                onClick: () => goToAddRule(item.rank),
                disabled: shouldDisableButton,
              },
              {
                hidden: !canCreate,
                label: t('acl.labelCopyRuleAbove'),
                onClick: () => goToCopyRule(item.rank),
                disabled: shouldDisableButton,
              },
              {
                hidden: !canCreate,
                label: t('acl.labelAddRuleBelow'),
                onClick: () => goToAddRule(item.rank + 1),
                disabled: shouldDisableButton,
              },
              {
                hidden: !canCreate,
                label: t('acl.labelCopyRuleBelow'),
                onClick: () => goToCopyRule(item.rank + 1),
                disabled: shouldDisableButton,
              },
            ],
          },
          {
            items: [
              {
                hidden: !canDelete,
                label: t('acl.deleteRule'),
                onClick: () => deleteAclRuleStart({ id: item.id, data: item }),
                disabled: shouldDisableButton,
              },
            ],
          },
        ]}
      />
    )
  )
}
