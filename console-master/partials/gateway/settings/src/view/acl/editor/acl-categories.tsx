//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Data } from '@ues-gateway/shared'

import AclCategoriesBuilder from './acl-categories-builder'
import AclMatchBuilder from './acl-match-builder'

const { getFetchAclRuleTask, updateLocalAclRuleData } = Data

const AclCategories: React.FC = () => {
  const fetchAclRuleTask = useSelector(getFetchAclRuleTask)
  const dispatch = useDispatch()

  return (
    <AclMatchBuilder
      initialData={fetchAclRuleTask?.data?.criteria?.categorySet}
      onChange={matchDefinition => dispatch(updateLocalAclRuleData({ criteria: { categorySet: matchDefinition } }))}
      criteriaBuilderComponent={<AclCategoriesBuilder />}
    />
  )
}

export default AclCategories
