import _, { isUndefined } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { Typography } from '@material-ui/core'

import { POLICY_TYPE, PolicyData, PolicyRules } from '@ues-data/dlp'
import { Permission } from '@ues-data/shared'
import { ContentAreaPanel, SecuredContentBoundary, useSecuredContent } from '@ues/behaviours'

import ActionSelect from './actions-select'
import { policyStyles } from './styles'

const supportedOsTypes = [
  'OPERATING_SYSTEM_TYPE_ALL',
  'OPERATING_SYSTEM_TYPE_WINDOWS',
  // 'OPERATING_SYSTEM_TYPE_IOS',
  // 'OPERATING_SYSTEM_TYPE_ANDROID_GENERIC',
  // 'OPERATING_SYSTEM_TYPE_WINDOWS',
]

const Actions = () => {
  useSecuredContent(Permission.BIP_POLICY_READ)

  const { t } = useTranslation('dlp/policy')
  const { actionSelectsWrapper } = policyStyles()
  const { guid } = useParams()
  const isAddMode = isUndefined(guid)
  const localPolicyRules = useSelector(PolicyData.getPolicyRules)
  const supportedPolicyRules = useSelector(PolicyData.getSupportedPolicyRules(supportedOsTypes, isAddMode))
  const dispatch = useDispatch()

  const handleSelectChange = selectedItem => {
    const updatedRules = localPolicyRules.map(rule => {
      if (rule.activity === selectedItem.activity) {
        rule.action = selectedItem.action
      }
      return rule
    })
    return dispatch(PolicyData.updateLocalPolicyData({ policyRules: updatedRules }))
  }

  return (
    <ContentAreaPanel title={t('policy.sections.actions.title')} ContentWrapper={SecuredContentBoundary}>
      <Typography variant="body2">{t('policy.sections.actions.description')}</Typography>
      <div className={actionSelectsWrapper}>
        {supportedPolicyRules?.map((rule, idx) => {
          return <ActionSelect key={[rule.action, idx].join('_')} policyRule={rule} onChange={handleSelectChange} />
        })}
      </div>
    </ContentAreaPanel>
  )
}

export default Actions
