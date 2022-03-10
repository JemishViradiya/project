import { PolicySchema } from '../../../model'

export const BISIsACLQueryMock = { isACL: true }

export const BISPolicySchemaQueryMock = { policySchema: PolicySchema.DetectionPolicy }

export const BISMigrateToDetectionPoliciesMutationMock = {
  migrateToDPAndACL: {
    dp: true,
    acl: true,
  },
}
