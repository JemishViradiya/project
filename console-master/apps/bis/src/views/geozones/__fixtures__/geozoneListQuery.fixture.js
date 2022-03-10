import { GeozoneListQuery } from '@ues-data/bis'

const DEFAULT_VARIABLES = Object.freeze({})

const createGeozoneListQueryMock = (variables = DEFAULT_VARIABLES) => ({
  request: { query: GeozoneListQuery.query, variables },
  result: {
    loading: false,
    data: {
      geozones: [
        {
          id: 'ID_1',
          name: 'Abc',
          risk: 'HIGH',
          location: 'Small Pebble',
          unit: '',
          geometry: {
            type: 'Circle',
            center: { lat: 1, lon: 1 },
            radius: 0.1,
            coordinates: null,
            countryName: null,
            state: null,
          },
        },
        {
          id: 'ID_2',
          name: 'Def',
          risk: 'LOW',
          location: 'Strange Rock',
          unit: '',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [1, 2],
              [2, 3],
              [3, 5],
              [1, 1],
            ],
            center: null,
            countryName: null,
            radius: null,
            state: null,
          },
        },
        {
          id: 'ID_3',
          location: 'LOCATION_3',
          name: 'NAME_3',
          risk: 'HIGH',
          unit: '',
          geometry: {
            center: {
              lat: 1,
              lon: 1,
            },
            coordinates: [
              [1, 1],
              [2, 2],
              [3, 3],
            ],
            countryName: null,
            radius: null,
            state: null,
            type: 'Polygon',
          },
        },
      ],
    },
  },
})

export { createGeozoneListQueryMock }
