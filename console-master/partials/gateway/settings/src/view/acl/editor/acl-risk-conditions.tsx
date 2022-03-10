//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Data, Types } from '@ues-gateway/shared'

import AclMatchBuilder from './acl-match-builder'
import AclRiskConditionsBuilder from './acl-risk-conditions-builder'

const { getFetchAclRuleTask, updateLocalAclRuleData } = Data
const { AclRuleMatchUIDefinition } = Types

const AclRiskConditions: React.FC = () => {
  const fetchAclRuleTask = useSelector(getFetchAclRuleTask)
  const dispatch = useDispatch()

  return (
    <AclMatchBuilder
      initialData={fetchAclRuleTask?.data?.criteria?.riskRange}
      customOptionValues={[AclRuleMatchUIDefinition.NotApplicable, AclRuleMatchUIDefinition.MatchesAny]}
      onChange={({ enabled }) => dispatch(updateLocalAclRuleData({ criteria: { riskRange: { enabled } } }))}
      criteriaBuilderComponent={<AclRiskConditionsBuilder />}
    />
  )
}

export default AclRiskConditions
