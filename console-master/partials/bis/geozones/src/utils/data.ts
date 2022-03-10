import type { CircularGeozoneEntity, GeozoneEntity, PolygonalGeozoneEntity } from '@ues-behaviour/google-maps'
import { GeozoneType } from '@ues-behaviour/google-maps'
import type { GeozonesListEntity } from '@ues-data/bis'
import { RiskLevel } from '@ues-data/shared-types'

const isPolygonEntity = (entity: GeozoneEntity): entity is PolygonalGeozoneEntity => entity.type === GeozoneType.Polygon
const isCircleEntity = (entity: GeozoneEntity): entity is CircularGeozoneEntity => entity.type === GeozoneType.Circle

const makeGeometryForMutationInput = (entity: GeozoneEntity): GeozonesListEntity['geometry'] => {
  if (isPolygonEntity(entity)) {
    return {
      coordinates: entity.geometry.coordinates.map(position => [position.lat, position.lng]),
      type: 'Polygon',
    }
  }

  if (isCircleEntity(entity)) {
    return {
      type: 'Circle',
      center: {
        lat: entity.geometry.center.lat,
        lon: entity.geometry.center.lng,
      },
      radius: entity.geometry.radius,
    }
  }

  throw new Error(`Unrecognized geozone entity type: ${(entity as any).type}.`)
}

export const geozoneEntityToMutationInput = (entity: GeozoneEntity): GeozonesListEntity => ({
  ...(entity.id ? { id: String(entity.id) } : {}),
  name: entity.name,
  unit: entity.unit,
  risk: RiskLevel.Low,
  geometry: makeGeometryForMutationInput(entity),
})

export const queryResultEntryToGeozoneEntity = (entry: GeozonesListEntity): GeozoneEntity => {
  if (entry.geometry.type === 'Circle') {
    return {
      id: entry.id,
      unit: entry.unit as any,
      name: entry.name,
      type: GeozoneType.Circle,
      metadata: {},
      geometry: {
        center: {
          lat: entry.geometry?.center?.lat,
          lng: entry.geometry?.center?.lon,
        } as any,
        radius: entry.geometry.radius as any,
      },
    }
  } else if (entry.geometry.type === 'Polygon') {
    return {
      id: entry.id,
      unit: entry.unit as any,
      name: entry.name,
      type: GeozoneType.Polygon,
      metadata: {},
      geometry: {
        coordinates: entry.geometry.coordinates.map(([lat, lng]) => ({
          lng,
          lat,
        })),
      },
    }
  }

  throw new Error(`Unrecognized entity type: ${entry.geometry.type}.`)
}

export const queryResultToGeozoneEntities = (result: GeozonesListEntity[] = []) =>
  result.map<GeozoneEntity>(queryResultEntryToGeozoneEntity)
