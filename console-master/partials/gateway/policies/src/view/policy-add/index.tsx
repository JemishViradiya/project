//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Permission, ReconciliationEntityType, usePermissions } from '@ues-data/shared'
import { Components, Config, Data, Types, Utils } from '@ues-gateway/shared'
import { ConfirmationState, useConfirmation } from '@ues/behaviours'

import PolicyEditor from '../policy-editor'
import type { PolicyComponentInterface } from '../types'

const { GATEWAY_TRANSLATIONS_KEY, POLICY_HELP_ID, POLICY_LOCALIZATION_TITLE_KEY, POLICY_VIEWS_PERMISSIONS_MAP } = Config
const { Page } = Types
const { makePageRoute } = Utils
const {
  queryPolicy,
  mutationAddPolicy,
  getHasUnsavedPolicyChanges: getHasUnsavedChanges,
  getPolicyTask: getEntityTask,
  getIsPolicyDefinitionValid: getIsEntityDefinitionValid,
  clearPolicy,
} = Data
const { EntityDetailsView, useEntityDetailsViewCopyModeListener } = Components

const POLICY_ADD_CONFIRMATION_TITLE_LOCALIZATION_KEY = {
  [ReconciliationEntityType.NetworkAccessControl]: 'policies.createNetworkAccessControlPolicyConfirmationTitle',
  [ReconciliationEntityType.GatewayApp]: 'policies.createGatewayPolicyConfirmationTitle',
}

const POLICY_COPY_TITLE_LOCALIZATION_KEY = {
  [ReconciliationEntityType.NetworkAccessControl]: 'policies.copyNetworkAccessControlPolicyTitle',
  [ReconciliationEntityType.GatewayApp]: 'policies.copyGatewayPolicyTitle',
}

const PolicyAdd: React.FC<PolicyComponentInterface> = ({ entityType }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigate = useNavigate()
  const confirmation = useConfirmation()
  const { hasPermission } = usePermissions()

  const entityDetailsViewCopyProps = useEntityDetailsViewCopyModeListener({
    dataLayer: queryPolicy,
    getArgs: () => ({ entityType }),
    pageHeading: { title: t(POLICY_COPY_TITLE_LOCALIZATION_KEY[entityType]) },
  })

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewayPolicies, { params: { entityType } })}
      permissions={[POLICY_VIEWS_PERMISSIONS_MAP[entityType], 'canCreate']}
      pageHeading={{
        title: t('policies.addPolicyWithName', { name: t(POLICY_LOCALIZATION_TITLE_KEY[entityType]).toLowerCase() }),
        helpId: POLICY_HELP_ID[entityType],
      }}
      saveAction={{
        dataLayer: mutationAddPolicy,
        getArgs: () => ({ entityType }),
        notificationMessages: {
          success: t('policies.createPolicySuccessMessage'),
          error: t('policies.createPolicyErrorMessage'),
          nameAlreadyUsedError: t('policies.nameAlreadyUsedError'),
        },
        onSuccess: async data => {
          // Check if we can assign users/groups to the policy
          let confirmationState = ConfirmationState.Canceled

          if (hasPermission(Permission.ECS_USERS_UPDATE)) {
            confirmationState = await confirmation({
              title: t(POLICY_ADD_CONFIRMATION_TITLE_LOCALIZATION_KEY[entityType]),
              description: t('policies.createPolicyConfirmationDescription'),
              cancelButtonLabel: t('common.notNow'),
              confirmButtonLabel: t('common.yes'),
            })
          }

          if (confirmationState === ConfirmationState.Confirmed) {
            navigate(
              makePageRoute(Page.GatewayPoliciesPolicyEditApplied, {
                params: { entityType, id: data.entityId },
              }),
            )
          }

          if (confirmationState === ConfirmationState.Canceled) {
            navigate(makePageRoute(Page.GatewayPolicies, { params: { entityType } }))
          }
        },
      }}
      redux={{
        selectors: { getHasUnsavedChanges, getEntityTask, getIsEntityDefinitionValid: getIsEntityDefinitionValid(entityType) },
        actions: { exitView: clearPolicy },
      }}
      {...entityDetailsViewCopyProps}
    >
      <PolicyEditor entityType={entityType} />
    </EntityDetailsView>
  )
}

export default PolicyAdd
