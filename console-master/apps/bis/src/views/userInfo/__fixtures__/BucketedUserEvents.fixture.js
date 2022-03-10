import { BucketedUserEventsQuery, BucketedUserEventsQueryMock } from '@ues-data/bis'

export const createBucketedUserEventsQueryMock = (variables, features = {}) => {
  const { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection } = features
  return {
    request: {
      query: BucketedUserEventsQuery(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection).query,
      variables,
    },
    result: {
      loading: false,
      data: { ...BucketedUserEventsQueryMock },
    },
  }
}
