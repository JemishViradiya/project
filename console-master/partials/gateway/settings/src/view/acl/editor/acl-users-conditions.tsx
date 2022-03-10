//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Data } from '@ues-gateway/shared'

import AclMatchBuilder from './acl-match-builder'
import AclUsersConditionsBuilder from './acl-users-conditions-builder'

const { getFetchAclRuleTask, updateLocalAclRuleData } = Data

const AclConditions: React.FC = () => {
  const fetchAclRuleTask = useSelector(getFetchAclRuleTask)
  const dispatch = useDispatch()

  return (
    <AclMatchBuilder
      initialData={fetchAclRuleTask?.data?.criteria?.selector}
      onChange={matchDefinition => dispatch(updateLocalAclRuleData({ criteria: { selector: matchDefinition } }))}
      criteriaBuilderComponent={<AclUsersConditionsBuilder />}
    />
  )
}

export default AclConditions
