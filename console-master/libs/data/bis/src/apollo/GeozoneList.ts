import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, ApolloDataUtils, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import {
  GeozoneIdsQueryMock,
  GeozoneListAddMutationMock,
  GeozoneListDeleteMutationMock,
  GeozoneListQueryMock,
  GeozoneListUpdateMutationMock,
} from './mocks'

const geozoneListSelection = `
  id
  name
  location
  risk
  unit
  geometry {
    type
    center {
      lat
      lon
    }
    radius
    coordinates
    countryName
    state
  }
`

export const GeozoneIdsQuery: ApolloQuery<typeof GeozoneIdsQueryMock, void> = {
  displayName: 'GeozoneIdsQuery',
  query: gql`
    query geozoneIds {
      geozones: BIS_geozones {
        id
        name
      }
    }
  `,
  mockQueryFn: () => GeozoneIdsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const GeozoneListQuery: ApolloQuery<typeof GeozoneListQueryMock, void> = {
  displayName: 'GeozoneListQuery',
  query: gql`
    query geozones {
      geozones: BIS_geozones {
        ${geozoneListSelection}
      }
    }
  `,
  mockQueryFn: () => GeozoneListQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const GeozoneListAddMutation = {
  displayName: 'GeozoneListAddMutation',
  mutation: gql`
    mutation createGeozone($input: GeozoneInput!) {
      createGeozone: BIS_createGeozone(input: $input) {
        ${geozoneListSelection}
      }
    }
  `,
  update: (cache, { data: { createGeozone } }) => {
    const { geozones = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: GeozoneListQuery.query })
    const zones = geozones.slice(0)
    zones.push(createGeozone)
    cache.writeQuery({
      query: GeozoneListQuery.query,
      data: { geozones: zones },
    })
  },
  mockMutationFn: () => GeozoneListAddMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const GeozoneListUpdateMutation = {
  displayName: 'GeozoneListUpdateMutation',
  mutation: gql`
    mutation updateGeozone($id: ID!, $input: GeozoneInput!) {
      updateGeozone: BIS_updateGeozone(id: $id, input: $input) {
        ${geozoneListSelection}
      }
    }
  `,
  update: (cache, { data: { updateGeozone } }) => {
    const { geozones = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: GeozoneListQuery.query })
    const zones = []
    geozones.forEach(zone => {
      if (zone.id === updateGeozone.id) {
        zones.push({ ...zone, ...updateGeozone })
      } else {
        zones.push(zone)
      }
    })
    cache.writeQuery({
      query: GeozoneListQuery.query,
      data: { geozones: zones },
    })
  },
  mockMutationFn: () => GeozoneListUpdateMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const GeozoneListDeleteMutation = {
  displayName: 'GeozoneListDeleteMutation',
  mutation: gql`
    mutation deleteGeozones($ids: [ID]!) {
      deleteGeozones: BIS_deleteGeozones(ids: $ids) {
        success
        fail
      }
    }
  `,
  update: (cache, { data: { deleteGeozones } }) => {
    const { geozones = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: GeozoneListQuery.query })
    const zones = geozones.slice(0)
    if (deleteGeozones.success) {
      deleteGeozones.success.forEach(id => {
        const index = zones.findIndex(zone => zone.id === id)
        if (index !== -1) {
          zones.splice(index, 1)
        }
      })
    }
    cache.writeQuery({
      query: GeozoneListQuery.query,
      data: { geozones: zones },
    })
  },
  mockMutationFn: () => GeozoneListDeleteMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
