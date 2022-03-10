/* eslint-disable sonarjs/no-duplicate-string */
export const GeozoneIdsQueryMock = {
  geozones: [
    { id: '754ffcad-6ee4-456c-a8f4-b8889ea1d514', name: 'Oymyakon' },
    { id: 'bfbdab4c-ecfa-4c66-8b06-feabe423c237', name: 'Waterloo' },
    { id: 'af739578-ab38-f948-1cff-dd83957ba7c6', name: 'Darfur' },
  ],
}

const geozones: any[] = [
  {
    id: 'af739578-ab38-f948-1cff-dd83957ba7c6',
    name: 'Darfur',
    location: 'Darfur, Sudan',
    risk: 'HIGH',
    unit: '',
    geometry: {
      type: 'Polygon',
      center: null,
      radius: null,
      coordinates: [
        [20.00302598917237, 24.026336044163827],
        [19.94107237320061, 27.585906356663827],
        [10.129758815516652, 28.201140731663827],
        [9.631885644492394, 27.871550887913827],
        [9.740182753660457, 23.696746200413827],
        [10.907475548296443, 22.883757919163827],
        [12.585386049794987, 22.488250106663827],
        [13.356212152754795, 22.290496200413827],
        [14.51844456989178, 22.405852645726327],
      ],
      countryName: null,
      state: null,
    },
  },
  {
    id: '754ffcad-6ee4-456c-a8f4-b8889ea1d514',
    name: 'Oymyakon',
    location: 'Oymyakon, Russia',
    risk: 'HIGH',
    unit: '',
    geometry: {
      type: 'Circle',
      center: { lat: 63.4641, lon: 142.7737 },
      radius: 2000,
      coordinates: null,
      countryName: null,
      state: null,
    },
  },
  {
    id: 'bfbdab4c-ecfa-4c66-8b06-feabe423c237',
    name: 'Waterloo',
    location: 'Waterloo, ON',
    risk: 'LOW',
    unit: '',
    geometry: {
      type: 'Circle',
      center: { lat: 43.4643, lon: -80.5204 },
      radius: 4000,
      coordinates: null,
      countryName: null,
      state: null,
    },
  },
]

export const GeozoneListQueryMock = {
  geozones,
}

export const GeozoneListAddMutationMock = { createGeozone: geozones }

export const GeozoneListUpdateMutationMock = { updateGeozone: geozones }

export const GeozoneListDeleteMutationMock = { deleteGeozones: { success: ['af739578-ab38-f948-1cff-dd83957ba7c6'], fail: [] } }
