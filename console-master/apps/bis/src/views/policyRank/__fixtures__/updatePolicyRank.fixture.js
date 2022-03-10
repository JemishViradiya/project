import { PolicyRankUpdateMutation } from '@ues-data/bis'

const { mutation } = PolicyRankUpdateMutation

export const DEFAULT_UPDATE_POLICY_RESULT = {
  loading: false,
  data: {
    updatePolicyRankings: null,
  },
}

const createUpdatePolicyRankMock = (variables, result = DEFAULT_UPDATE_POLICY_RESULT) => {
  return {
    request: {
      query: mutation,
      variables,
    },
    result,
  }
}

export { createUpdatePolicyRankMock }
