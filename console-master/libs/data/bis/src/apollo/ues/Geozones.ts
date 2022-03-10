import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, ApolloDataUtils, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import {
  CreateGeozoneMutationResultMock,
  DeleteGeozonesMutationResultMock,
  GeozonesQueryResultMock,
  UpdateGeozoneMutationResultMock,
} from '../mocks'

export interface GeozonesListEntity {
  id?: string
  name: string
  location?: string
  risk?: string
  unit?: string
  geometry: {
    type: string
    center?: { lat: number; lon: number }
    radius?: number
    coordinates?: number[][]
    countryName?: string
    state?: string
  }
}

interface GeozoneListQueryResult {
  geozones: GeozonesListEntity[]
}

export const GeozonesQuery: ApolloQuery<GeozoneListQueryResult, void> = {
  displayName: 'GeozonesQuery',
  query: gql`
    query geozones {
      geozones: BIS_geozones {
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
      }
    }
  `,
  mockQueryFn: () => GeozonesQueryResultMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

interface CreateGeozoneMutationResult {
  createGeozone: GeozonesListEntity
}

interface CreateGeozoneMutationVariables {
  input: GeozonesListEntity
}

export const CreateGeozoneMutation: ApolloMutation<CreateGeozoneMutationResult, CreateGeozoneMutationVariables> = {
  mutation: gql`
    mutation createGeozone($input: GeozoneInput!) {
      createGeozone: BIS_createGeozone(input: $input) {
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
      }
    }
  `,
  mockMutationFn: () => CreateGeozoneMutationResultMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  update: (cache, { data: { createGeozone } }) => {
    const { geozones = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: GeozonesQuery.query })
    const zones = [...geozones, createGeozone]

    cache.writeQuery({
      query: GeozonesQuery.query,
      data: { geozones: zones },
    })
  },
}

interface UpdateGeozoneMutationResult {
  updateGeozone: GeozonesListEntity
}

interface UpdateGeozoneMutationVariables {
  id: string
  input: GeozonesListEntity
}

export const UpdateGeozoneMutation: ApolloMutation<UpdateGeozoneMutationResult, UpdateGeozoneMutationVariables> = {
  mutation: gql`
    mutation updateGeozone($id: ID!, $input: GeozoneInput!) {
      updateGeozone: BIS_updateGeozone(id: $id, input: $input) {
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
      }
    }
  `,
  mockMutationFn: () => UpdateGeozoneMutationResultMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  update: (cache, { data: { updateGeozone } }) => {
    const { geozones = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: GeozonesQuery.query }) ?? {}
    const zones = []
    geozones.forEach(zone => {
      if (zone.id === updateGeozone.id) {
        zones.push({ ...zone, ...updateGeozone })
      } else {
        zones.push(zone)
      }
    })
    cache.writeQuery({
      query: GeozonesQuery.query,
      data: { geozones: zones },
    })
  },
  id: 'bis.updateGeozone',
}

interface DeleteGeozoneMutationResult {
  deleteGeozones: {
    success: string[]
    fail: string[]
  }
}

interface DeleteGeozoneMutationVariables {
  ids: string[]
}

export const DeleteGeozonesMutation: ApolloMutation<DeleteGeozoneMutationResult, DeleteGeozoneMutationVariables> = {
  mutation: gql`
    mutation deleteGeozones($ids: [ID]!) {
      deleteGeozones: BIS_deleteGeozones(ids: $ids) {
        success
        fail
      }
    }
  `,
  mockMutationFn: () => DeleteGeozonesMutationResultMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  update: (
    cache,
    {
      data: {
        deleteGeozones: { success },
      },
    },
  ) => {
    const { geozones = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: GeozonesQuery.query }) ?? {}
    const ids = new Set(success)
    cache.writeQuery({
      query: GeozonesQuery.query,
      data: { geozones: geozones.filter(zone => !ids.has(zone.id)) },
    })
  },
  id: 'bis.deleteGeozones',
}
