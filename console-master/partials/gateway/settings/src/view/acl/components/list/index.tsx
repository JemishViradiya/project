//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useSelector } from 'react-redux'

import { usePrevious } from '@ues-behaviour/react'
import { Data } from '@ues-gateway/shared'

import type { AclListProps } from '../../types'
import AclInfiniteList from './list-infinite'
import AclRankableList from './list-rankable'

const { getListRankModeEnabled, getCommitDraftTask, getUpdateAclRuleTask, getDeleteAclRuleTask } = Data

const AclList: React.FC<AclListProps> = props => {
  const rankModeEnabled = useSelector(getListRankModeEnabled)
  const updateRuleTask = useSelector(getUpdateAclRuleTask)
  const deleteRuleTask = useSelector(getDeleteAclRuleTask)
  const createDraftTask = useSelector(getCommitDraftTask)

  const previousTotal = usePrevious(props.total)

  const listProps: AclListProps = {
    ...props,
    total: props.total ?? previousTotal,
    loading: props.loading || updateRuleTask?.loading || deleteRuleTask?.loading || createDraftTask?.loading,
  }

  return rankModeEnabled ? <AclRankableList {...listProps} /> : <AclInfiniteList {...listProps} />
}

export default AclList
