import { gql } from '@apollo/client'

import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { UserRiskEventQueryMock } from './mocks'

export const UserRiskEventQuery = {
  displayName: 'UserRiskEventQuery',
  query: gql`
    query userRiskEvents($userId: String!) {
      userInfo: BIS_userInfo(userId: $userId) {
        avatar
        displayName
        department
        givenName
        familyName
        username
        primaryEmail
        title
      }
    }
  `,
  subscription: gql`
    subscription onUserRiskEventAdded($userId: String!, $range: TimeRange!) {
      userRiskEventAdded: BIS_userRiskEventAdded(userId: $userId, range: $range) {
        id
        behaviorRisk
        behaviorRiskLevel
        geozoneRiskLevel
        location {
          lat
          lon
          geohash
        }
        time
        ip
        datapoint {
          source {
            appName
            deviceModel
          }
        }
        operatingMode
        sisActions {
          policyName
          actions {
            type
            groupId
            groupName
            profileId
            profileName
            alertMessage
            entityId
            name
          }
        }
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
    }
  },
  mockQueryFn: () => UserRiskEventQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
