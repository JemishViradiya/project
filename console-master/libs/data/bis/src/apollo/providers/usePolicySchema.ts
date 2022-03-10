import { useEffect, useState } from 'react'

import { useApolloClient } from '@apollo/client'

import { ApolloDataUtils, FeatureName, useFeatures, useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import { PolicySchema } from '../../model'
import type { IsACLResponse, PolicySchemaResponse } from '../ues'
import { BISIsACLQuery, BISMigrateToDPAndACLMutation, BISPolicySchemaQuery } from '../ues'

const usePolicySchema = () => {
  const { isEnabled } = useFeatures()
  const actorDPEnabled = isEnabled(FeatureName.UESActionOrchestrator)
  const apolloClient = useApolloClient()
  const [isMigratedToDP, setIsMigratedToDP] = useState(
    () =>
      ApolloDataUtils.getApolloCachedValue<unknown, PolicySchemaResponse, void>(apolloClient.cache, {
        query: BISPolicySchemaQuery.query,
      })?.policySchema === PolicySchema.DetectionPolicy,
  )
  const [isMigratedToACL, setIsMigratedToACL] = useState(
    () =>
      ApolloDataUtils.getApolloCachedValue<unknown, IsACLResponse, void>(apolloClient.cache, {
        query: BISIsACLQuery.query,
      })?.isACL === true,
  )

  const policySchemaQueryResult = useStatefulApolloQuery(BISPolicySchemaQuery, {
    fetchPolicy: 'cache-first',
    skip: !actorDPEnabled || isMigratedToDP,
  })
  const isACLQueryResult = useStatefulApolloQuery(BISIsACLQuery, {
    fetchPolicy: 'cache-first',
    skip: isMigratedToACL,
  })

  const [migrateToDPAndACL, migrateToDPAndACLResult] = useStatefulApolloMutation(BISMigrateToDPAndACLMutation)

  useEffect(() => {
    if (
      !isMigratedToDP &&
      (policySchemaQueryResult?.data?.policySchema === PolicySchema.DetectionPolicy ||
        migrateToDPAndACLResult?.data?.migrateToDPAndACL?.dp)
    ) {
      setIsMigratedToDP(true)
    }
    if (!isMigratedToACL && (isACLQueryResult?.data?.isACL || migrateToDPAndACLResult?.data?.migrateToDPAndACL?.acl)) {
      setIsMigratedToACL(true)
    }
  }, [
    isACLQueryResult?.data?.isACL,
    isMigratedToACL,
    isMigratedToDP,
    migrateToDPAndACLResult?.data,
    policySchemaQueryResult?.data?.policySchema,
  ])

  return {
    isMigratedToDP,
    isMigratedToACL,
    migrateToDPAndACL,
    migrateToDPAndACLResult,
  } as const
}

export default usePolicySchema
