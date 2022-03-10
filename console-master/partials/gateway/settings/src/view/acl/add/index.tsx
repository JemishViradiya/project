//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import AclEditor from '../editor'
import { useAclRouteDetails, useNavigateToView } from '../hooks'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { BigService, useQueryParams } = Hooks
const {
  mutationAddAclRule,
  getHasUnsavedAclRuleChanges: getHasUnsavedChanges,
  getFetchAclRuleTask: getEntityTask,
  getIsAclRuleDefinitionValid: getIsEntityDefinitionValid,
  queryAclRule,
  clearAclRule,
} = Data
const { EntityDetailsView, useEntityDetailsViewCopyModeListener } = Components
const { GatewayRouteParamName, AclRulesType, Page } = Types
const { makePageRoute } = Utils

const AclAdd: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigateToView = useNavigateToView()
  const expectedRank = useQueryParams().get(GatewayRouteParamName.Rank)
  const { isCommittedView, rulesType } = useAclRouteDetails()

  const entityDetailsViewCopyProps = useEntityDetailsViewCopyModeListener({
    dataLayer: queryAclRule,
    getArgs: () => ({ isCommittedView }),
    pageHeading: { title: t('acl.labelCopyAclRule') },
  })

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewaySettingsAcl, { params: { rulesType } })}
      permissions={[BigService.Acl, 'canCreate']}
      pageHeading={{ title: t('acl.labelAddAclRule') }}
      saveAction={{
        dataLayer: mutationAddAclRule,
        getArgs: () => ({ expectedRank }),
        notificationMessages: {
          success: t('acl.createAclRuleSuccessMessage'),
          error: t('acl.createAclRuleErrorMessage'),
          nameAlreadyUsedError: t('acl.nameAlreadyUsedError'),
        },
        onSuccess: () => navigateToView(AclRulesType.Draft),
      }}
      redux={{
        selectors: { getHasUnsavedChanges, getEntityTask, getIsEntityDefinitionValid },
        actions: { exitView: clearAclRule },
      }}
      {...entityDetailsViewCopyProps}
    >
      <AclEditor />
    </EntityDetailsView>
  )
}

export default AclAdd
