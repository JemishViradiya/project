/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions, UesApolloClient } from '@ues-data/shared'

const queryGetDashboardGql = gql`
  query getDashboard($dashboardId: String!) {
    getDashboard(dashboardId: $dashboardId) {
      dashboardId
      title
      globalTime
      cardState
      layoutState
    }
  }
`

const queryGetTitlesGql = gql`
  query getDashboards {
    getDashboards {
      dashboardId
      title
    }
  }
`

const addDashboardGql = gql`
  mutation addDashboard($dashboardId: String!, $title: String!, $globalTime: String!, $cardState: String, $layoutState: String) {
    addDashboard(
      dashboardId: $dashboardId
      title: $title
      globalTime: $globalTime
      cardState: $cardState
      layoutState: $layoutState
    )
  }
`

const deleteDashboardGql = gql`
  mutation deleteDashboard($dashboardId: String!) {
    deleteDashboard(dashboardId: $dashboardId)
  }
`

const updateDashboardTitleGql = gql`
  mutation updateDashboardTitle($dashboardId: String!, $title: String!) {
    updateDashboardTitle(dashboardId: $dashboardId, title: $title)
  }
`

const updateDashboardGlobalTimeGql = gql`
  mutation updateDashboardGlobalTime($dashboardId: String!, $globalTime: String!) {
    updateDashboardGlobalTime(dashboardId: $dashboardId, globalTime: $globalTime)
  }
`

const updateDashboardCardStateGql = gql`
  mutation updateDashboardCardState($dashboardId: String!, $cardState: String) {
    updateDashboardCardState(dashboardId: $dashboardId, cardState: $cardState)
  }
`

const updateDashboardLayoutStateGql = gql`
  mutation updateDashboardLayoutState($dashboardId: String!, $layoutState: String) {
    updateDashboardLayoutState(dashboardId: $dashboardId, layoutState: $layoutState)
  }
`

const updateDashboardCardAndLayoutStateGql = gql`
  mutation updateDashboardCardAndLayoutState($dashboardId: String!, $cardState: String, $layoutState: String) {
    updateDashboardCardAndLayoutState(dashboardId: $dashboardId, cardState: $cardState, layoutState: $layoutState) {
      cardState
      layoutState
    }
  }
`

export interface DashboardsQueryVariables {
  dashboardId?: string
}

export interface DashboardStateVariables {
  dashboardId: string
  title?: string
  globalTime?: string
  cardState?: string
  layoutState?: string
}

const queryDashboardMock = JSON.parse(
  '{"getDashboard":{"dashboardId":"mockDashboard","title":"Dashboard title","globalTime":"last24Hours","cardState":"{}","layoutState":"[]"}}',
)

// const queryTitlesMock = {
//   getDashboards: [
//     { dashboardId: '001', title: 'Dashboard title1' },
//     { dashboardId: '002', title: 'Dashboard title2' },
//   ],
// }

const duplicateTitleErrorMsg = 'Title already exists'

const queryTitlesMock = { getDashboards: [] }

const queryCountMock = { getDashboardCount: 1 }

export const queryDashboard: ApolloQuery<unknown, DashboardsQueryVariables> = {
  mockQueryFn: () => queryDashboardMock,
  query: queryGetDashboardGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
  permissions: NoPermissions,
}

export const queryDashboardTitles: ApolloQuery<unknown, unknown> = {
  mockQueryFn: () => queryTitlesMock,
  query: queryGetTitlesGql,
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
  permissions: NoPermissions,
}

export const addDashboardMutation: ApolloMutation<unknown, DashboardStateVariables> = {
  mutation: addDashboardGql,
  mockMutationFn: (vars: DashboardStateVariables) => {
    if (vars.title.toLowerCase().includes('duplicate')) {
      throw Object.assign(new Error(duplicateTitleErrorMsg), {
        graphQLErrors: [
          {
            path: ['addDashboard'],
            message: duplicateTitleErrorMsg,
            extensions: { code: 'BAD_USER_INPUT' },
          },
        ],
      })
    } else {
      return { addDashboard: true }
    }
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const deleteDashboardMutation: ApolloMutation<unknown, DashboardsQueryVariables> = {
  mutation: deleteDashboardGql,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const updateDashboardTitleMutation: ApolloMutation<unknown, DashboardStateVariables> = {
  mutation: updateDashboardTitleGql,
  mockMutationFn: (vars: DashboardStateVariables) => {
    if (vars.title.toLowerCase().includes('duplicate')) {
      throw Object.assign(new Error(duplicateTitleErrorMsg), {
        graphQLErrors: [
          {
            path: ['updateDashboardTitle'],
            message: duplicateTitleErrorMsg,
            extensions: { code: 'BAD_USER_INPUT' },
          },
        ],
      })
    } else {
      return { updateDashboardTitle: vars.title }
    }
  },
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const updateDashboardGlobalTimeMutation: ApolloMutation<unknown, DashboardStateVariables> = {
  mutation: updateDashboardGlobalTimeGql,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const updateDashboardCardStateMutation: ApolloMutation<unknown, DashboardStateVariables> = {
  mutation: updateDashboardCardStateGql,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const updateDashboardLayoutMutation: ApolloMutation<unknown, DashboardStateVariables> = {
  mutation: updateDashboardLayoutStateGql,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const updateDashboardCardAndLayoutMutation: ApolloMutation<unknown, DashboardStateVariables> = {
  mutation: updateDashboardCardAndLayoutStateGql,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.DASHBOARD_BFF),
}

export const getCurrentDashboardState = ({ dashboardId }: DashboardStateVariables): Promise<unknown> => {
  return UesApolloClient.query({
    ...queryDashboard,
    fetchPolicy: 'network-only',
    variables: { dashboardId },
  }).then(response => {
    return response.data
  })
}

export const addNewDashboardState = (variables: DashboardStateVariables): Promise<unknown> => {
  return UesApolloClient.mutate({
    ...addDashboardMutation,
    variables,
  }).then(response => {
    return response.data
  })
}
