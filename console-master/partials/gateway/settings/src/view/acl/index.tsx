//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Types } from '@ues-gateway/shared'
import type { ViewWrapperProps } from '@ues/behaviours'
import { Tabs, useRoutedTabsProps } from '@ues/behaviours'

import { useNavigateToViewListener, useNotExistingDraftConflictResolver } from './hooks'
import useStyles from './styles'

const {
  getListRankModeEnabled,
  getCreateDraftTask,
  getHasAclRulesDraft,
  queryCommittedAclRulesProfile,
  queryDraftAclRulesProfile,
  getFetchDraftAclRulesProfileTask,
  getFetchCommittedAclRulesProfileTask,
} = Data
const { useBigPermissions, BigService } = Hooks
const { LoadingProgress } = Components
const { AclRulesType } = Types
const { GATEWAY_TRANSLATIONS_KEY } = Config

const Acl: React.FC<Pick<ViewWrapperProps, 'tabs'>> = ({ tabs }) => {
  useBigPermissions(BigService.Acl)
  useNotExistingDraftConflictResolver()
  useNavigateToViewListener(useSelector(getCreateDraftTask), AclRulesType.Draft)

  useStatefulReduxQuery(queryCommittedAclRulesProfile)
  const committedAclRulesProfileTask = useSelector(getFetchCommittedAclRulesProfileTask)
  useStatefulReduxQuery(queryDraftAclRulesProfile)
  const draftAclRulesProfileTask = useSelector(getFetchDraftAclRulesProfileTask)

  const aclProfilesLoading = committedAclRulesProfileTask?.loading || draftAclRulesProfileTask?.loading

  const classes = useStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const hasAclRulesDraft = useSelector(getHasAclRulesDraft)
  const rankModeEnabled = useSelector(getListRankModeEnabled)

  const [committedTab, draftTab] = tabs

  const tabProps = useRoutedTabsProps({
    tabs: [
      { ...committedTab, disabled: rankModeEnabled },
      { ...draftTab, disabled: rankModeEnabled, hidden: !hasAclRulesDraft },
    ],
  })

  return aclProfilesLoading ? (
    <LoadingProgress alignSelf="center" />
  ) : (
    <Tabs {...tabProps} classes={{ root: classes.tabs }} fullScreen />
  )
}

export default Acl
