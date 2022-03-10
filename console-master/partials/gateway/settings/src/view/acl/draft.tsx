//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Config, Data, Types, Utils } from '@ues-gateway/shared'

import { AclConflictAlert, AclDraftUpdateActions, AclList, AclTabContent } from './components'

const { GATEWAY_TRANSLATIONS_KEY, DEFAULT_LIST_QUERY_PARAMS } = Config

const { getListRankModeEnabled, queryDraftAclRules, getHasAclRulesDraft } = Data
const { AclRulesType, Page } = Types
const { makePageRoute } = Utils

const AclRulesDraftList = () => {
  const rankModeEnabled = useSelector(getListRankModeEnabled)

  const { data, loading, refetch } = useStatefulReduxQuery(queryDraftAclRules, {
    variables: { params: DEFAULT_LIST_QUERY_PARAMS },
  })

  return (
    <>
      <AclConflictAlert />

      <AclList loading={loading} refetch={params => refetch({ params })} total={data?.response?.totals?.elements} />

      {!rankModeEnabled && <AclDraftUpdateActions />}
    </>
  )
}

const AclDraft: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const hasAclRulesDraft = useSelector(getHasAclRulesDraft)

  if (!hasAclRulesDraft) {
    return <Navigate to={makePageRoute(Page.GatewaySettingsAcl, { params: { rulesType: AclRulesType.Committed } })} />
  }

  return (
    <AclTabContent title={t('acl.labelAclRulesTopLevelDraftDescription')} boxProps={{ pb: 20 }}>
      <AclRulesDraftList />
    </AclTabContent>
  )
}

export default AclDraft
