/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Box } from '@material-ui/core'

import { POLICY_TYPE, PolicyData } from '@ues-data/dlp'
import type { ReduxQueryOptions } from '@ues-data/shared'
import { Permission, useStatefulReduxQuery } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { PageTitlePanel, useConfirmation, useSecuredContent } from '@ues/behaviours'

import cancelNavigation from './helpers/cancelNavigation'
import PolicyEditor from './policy-editor'

const PolicyCreate = (): JSX.Element => {
  useSecuredContent(Permission.BIP_POLICY_READ)

  const { t } = useTranslation('dlp/policy')
  const { policyType: urlPolicyType } = useParams()
  const confirmation = useConfirmation()
  const policyTypeName = urlPolicyType.toUpperCase()
  const isContentPolicyType = urlPolicyType.toUpperCase() === POLICY_TYPE.CONTENT
  const policyTypeValue = isContentPolicyType ? POLICY_TYPE.CONTENT : POLICY_TYPE.MOBILE
  const navigate = useNavigate()
  const hasUnsavedChanges = useSelector(PolicyData.getHasUnsavedPolicyChanges(true))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(PolicyData.clearPolicy())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPolicySettingDefinitionParam: ReduxQueryOptions<{ type: typeof policyTypeValue }> = {
    variables: { type: POLICY_TYPE[policyTypeName] },
  }
  // preload policy defintion data
  const { loading } = useStatefulReduxQuery(PolicyData.queryPolicySettingDefinition, getPolicySettingDefinitionParam)

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <PageTitlePanel
        title={t('policy.addPolicyWithType', { policyType: urlPolicyType })}
        goBack={() => cancelNavigation(hasUnsavedChanges, confirmation, navigate, t, urlPolicyType)}
        helpId={HelpLinks.DlpContentPolicy}
      />
      <PolicyEditor contentAreaDisplaying={true} />
    </Box>
  )
}

export default PolicyCreate
