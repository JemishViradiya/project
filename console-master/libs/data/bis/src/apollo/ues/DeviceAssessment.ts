import { gql } from '@apollo/client'

import type { ApolloQuery, RiskLevel } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'
import type { ActorDetectionType } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import { DeviceAssessmentQueryMock } from '../mocks'

export interface DeviceAssessmentResult {
  deviceAssessment: {
    items: {
      policyName: string
      riskLevel: RiskLevel
      deviceId: string
      detectionTime: number
      detections: { name: ActorDetectionType; level: RiskLevel; contributes: boolean }[]
    }[]
  }
}

export const DeviceAssessmentQuery: ApolloQuery<
  DeviceAssessmentResult,
  {
    userId: string
    deviceId?: string[]
  }
> = {
  displayName: 'DeviceAssessmentQuery',
  query: gql`
    query deviceAssessment($userId: String!, $deviceId: [String]) {
      deviceAssessment: BIS_deviceAssessment(userId: $userId, deviceId: $deviceId) {
        items {
          policyName
          riskLevel
          deviceId
          detectionTime
          detections {
            name
            level
            contributes
          }
        }
      }
    }
  `,
  mockQueryFn: ({ deviceId: deviceIds }) => {
    if (deviceIds?.length > 0) {
      return {
        deviceAssessment: { items: DeviceAssessmentQueryMock.items.filter(d => deviceIds.includes(d.deviceId)).map(d => d) },
      }
    }

    return { deviceAssessment: DeviceAssessmentQueryMock }
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.ECS_DEVICES_READ]),
}
