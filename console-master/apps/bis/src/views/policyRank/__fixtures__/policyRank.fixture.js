import { PolicyRankQuery } from '@ues-data/bis'

const { query } = PolicyRankQuery

const FIRST_POLICY_NUMBER = 1

const createPolicies = policiesCount => {
  const policies = []

  for (let i = FIRST_POLICY_NUMBER; i < policiesCount + FIRST_POLICY_NUMBER; i++) {
    policies.push({ id: `POLICY_ID_${i}`, name: `POLICY_NAME_${i}` })
  }

  return policies
}

const createPolicyRankMock = policiesCount => {
  return {
    request: { query },
    result: {
      data: {
        policies: createPolicies(policiesCount),
      },
    },
  }
}

export { createPolicyRankMock }
