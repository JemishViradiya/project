import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { UserReadPermissions } from '../../shared/permissions'

// Define the graph ql query for groups export
const queryGetGroupsCsvGql = gql`
  query GetGroupsCsv($sortBy: String, $query: String) {
    userGroupsCsv(sortBy: $sortBy, query: $query) {
      data
    }
  }
`

export interface GroupsExportQueryVariables {
  sortBy?: string
  query?: string
}

const groupsExportMock = [
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    name: 'Default',
    isOnboardingEnabled: true,
    directoryLink: '',
    userCount: 0,
  },
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e636',
    name: 'All users',
    isOnboardingEnabled: false,
    directoryLink: '',
    userCount: 7,
  },
  {
    id: '413aaf5b-7460-48a9-9e5b-eea681ee0563',
    name: 'With enrollment policy',
    isOnboardingEnabled: false,
    directoryLink: '',
    userCount: 4,
  },
  {
    id: 'e9a2b066-d37c-4890-94c0-7953e717e63679',
    name: 'With network policy',
    isOnboardingEnabled: false,
    directoryLink: '',
    userCount: 3,
  },
]

const Mock = {
  userGroupsCsv: {
    data:
      'id,name,isOnboardingEnabled,directoryLink,userCount\r\n' +
      groupsExportMock.map(g => Object.values(g).join(',')).join('\r\n'),
  },
}

export const queryGroupsExport: ApolloQuery<any, GroupsExportQueryVariables> = {
  mockQueryFn: () => Mock,
  query: queryGetGroupsCsvGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.PLATFORM_BFF),
  permissions: UserReadPermissions,
}
