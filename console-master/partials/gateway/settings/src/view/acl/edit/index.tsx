//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import AclEditor from '../editor'
import { useAclRouteDetails, useNavigateToView } from '../hooks'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { BigService } = Hooks
const { Page, AclRulesType } = Types
const {
  queryAclRule,
  getHasUnsavedAclRuleChanges: getHasUnsavedChanges,
  getFetchAclRuleTask: getEntityTask,
  getIsAclRuleDefinitionValid: getIsEntityDefinitionValid,
  mutationUpdateAclRule,
  mutationDeleteAclRule,
  clearAclRule,
  getHasAclRulesDraft,
} = Data
const { EntityDetailsView } = Components
const { makePageRoute } = Utils

const AclEdit: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { id } = useParams()
  const navigateToView = useNavigateToView()
  const fetchAclRuleTask = useSelector(getEntityTask)
  const hasAclRulesDraft = useSelector(getHasAclRulesDraft)
  const { isCommittedView, rulesType } = useAclRouteDetails()

  useStatefulReduxQuery(queryAclRule, { variables: { id, isCommittedView } })

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewaySettingsAcl, { params: { rulesType } })}
      permissions={[BigService.Acl, 'canRead']}
      pageHeading={{ title: [t('acl.labelEditAclRule'), fetchAclRuleTask?.data?.name] }}
      copyAction={{
        onNavigateTo: () =>
          makePageRoute(Page.GatewaySettingsAclCopy, {
            params: { id, rulesType },
          }),
      }}
      readOnly={isCommittedView && hasAclRulesDraft}
      removeAction={{
        dataLayer: mutationDeleteAclRule,
        notificationMessages: {
          success: t('acl.deleteAclRuleSuccessMessage'),
          error: t('acl.deleteAclRuleErrorMessage'),
          nameAlreadyUsedError: t('acl.nameAlreadyUsedError'),
        },
        onSuccess: () => navigateToView(AclRulesType.Draft),
      }}
      saveAction={{
        dataLayer: mutationUpdateAclRule,
        notificationMessages: {
          success: t('acl.updateAclRuleSuccessMessage'),
          error: t('acl.updateAclRuleErrorMessage'),
        },
        onSuccess: () => navigateToView(AclRulesType.Draft),
      }}
      redux={{
        selectors: { getHasUnsavedChanges, getEntityTask, getIsEntityDefinitionValid },
        actions: { exitView: clearAclRule },
      }}
    >
      <AclEditor />
    </EntityDetailsView>
  )
}

export default AclEdit
