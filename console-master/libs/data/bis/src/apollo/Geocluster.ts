import { gql } from '@apollo/client'

import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { GeoclusterQueryMock } from './mocks'

const geoclusterSelection = `
  count
  data {
    lat
    lon
    geohash
    bounds {
      top_left {
        lat
        lon
      }
      bottom_right {
        lat
        lon
      }
    }
    count
    critical
    high
    medium
    low
  }
`

const geoclusterBoxSelection = `
  count
  data {
    geohash
    lat
    lon
    bounds {
      top_left {
        lat
        lon
        geohash
      }
      bottom_right {
        lat
        lon
        geohash
      }
    }
    count
    critical
    high
    representative
  }
`

export const GeoclusterQuery = {
  displayName: 'GeoclusterQuery',
  query: gql`
    query geoClusters($range: TimeRange!, $riskTypes: [String!]!) {
      geoClusters: BIS_geoClusters(range: $range, riskTypes: $riskTypes) {
        ${geoclusterSelection}
      }
    }
  `,
  subscription: gql`
    subscription onGeoClustersChanged($range: TimeRange!, $riskTypes: [String!]!) {
      geoClustersChanged: BIS_geoClustersChanged(range: $range, riskTypes: $riskTypes) {
        ${geoclusterSelection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      geoClusters: subscriptionData.data.geoClustersChanged,
    }
  },
  mockQueryFn: () => GeoclusterQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

// and now, the same thing again, except for providing a bounding box for the clusters...
export const GeoclusterBoxQuery = {
  displayName: 'GeoclusterBoxQuery',
  query: gql`
    query geoClustersBox($range: TimeRange!, $box: InputBoundingBox, $zoomLevel: Int = 1) {
      geoClustersBox: BIS_geoClustersBox(range: $range, box: $box, zoomLevel: $zoomLevel) {
        ${geoclusterBoxSelection}
      }
    }
  `,
  subscription: gql`
    subscription onGeoClustersChangedBox($range: TimeRange!, $box: InputBoundingBox, $zoomLevel: Int = 1) {
      geoClustersChangedBox: BIS_geoClustersChangedBox(range: $range, box: $box, zoomLevel: $zoomLevel) {
        ${geoclusterBoxSelection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      geoClustersBox: subscriptionData.data.geoClustersChangedBox,
    }
  },
  // don't provide "mockQueryFn" intentionally, we can turn it on when we start using this query
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
