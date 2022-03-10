import { randomString } from '../utils'
import { CURSOR_ENDPOINT_CORE } from './table.constants'

const createData = (name, calories, fat, carbs, protein, isYummy, dateModified, dateCreated, lastEaten) => ({
  id: Math.random().toString(),
  name,
  calories,
  fat,
  carbs,
  protein,
  isYummy,
  dateModified,
  dateCreated,
  lastEaten,
})

function createDataGroup(number) {
  return [
    createData(
      `Frozen yoghurt (Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua) ${number}`,
      159,
      6.0,
      24,
      4.0,
      false,
      new Date('02/23/2011'),
      new Date('02/20/2011'),
      new Date('2011-02-20T00:32:00Z'),
    ),
    createData(
      `Ice cream sandwich ${number}`,
      237,
      9.0,
      37,
      4.3,
      true,
      new Date('04/05/2019'),
      new Date('03/15/2019'),
      new Date('2020-04-15T14:22:00Z'),
    ),
    createData(
      `Eclair ${number}`,
      262,
      16.0,
      24,
      6.0,
      true,
      new Date('01/11/2019'),
      new Date('01/01/2019'),
      new Date('2019-01-18T16:45:00Z'),
    ),
    createData(
      `Cupcake ${number}`,
      305,
      3.7,
      67,
      4.3,
      true,
      new Date('06/16/2018'),
      new Date('06/10/2018'),
      new Date('2018-06-23T09:45:00Z'),
    ),
    createData(
      `Gingerbread ${number}`,
      356,
      16.0,
      49,
      3.9,
      false,
      new Date('10/19/2018'),
      new Date('10/03/2018'),
      new Date('2018-10-31T21:14:00Z'),
    ),
    createData(
      `Cake ${number}`,
      300,
      3.7,
      67,
      4.3,
      false,
      new Date('12/19/2018'),
      new Date('12/03/2018'),
      new Date('2018-10-31T22:14:00Z'),
    ),
  ]
}

function getFatValueItems() {
  return [6.0, 9.0, 16.0, 3.7]
}

function getFatItemsLocalization() {
  return { 6.0: '6.0%', 9.0: '9.0%', 16.0: '16.0%', 3.7: '3.7%' }
}

function getProteinValueItems() {
  return [4.0, 4.3, 6.0, 3.9]
}

function getProteinItemsLocalization() {
  return { 4.0: '4.0%', 4.3: '4.3%', 6.0: '6.0%', 3.9: '3.9%' }
}

function getAutocomplete(value) {
  return [
    `Frozen yoghurt (Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua)`,
    `Ice cream sandwich`,
    `Eclair`,
    `Cupcake`,
    `Gingerbread`,
  ].filter(e => e.includes(value))
}

function getMockData() {
  let rowData = []
  for (let i = 1; i < 20; i++) {
    rowData = rowData.concat(createDataGroup(i))
  }

  return rowData
}

function getDataForDifferentTypes() {
  const data = []
  for (let i = 1; i <= 5; i++) {
    data.push({
      id: Math.random().toString(),
      name: 'Item link ' + i,
      date: new Date('10/19/2018'),
      description: randomString(),
      numeric: Math.floor(Math.random() * 100 + 1),
      icon: i === 1 ? -1 : i % 2 === 0,
    })
  }
  return data
}

function getCursorMockData() {
  const maxEndpoints = 10
  let currentEndpoint = CURSOR_ENDPOINT_CORE
  let mockData = {}

  for (let n = 0; n <= maxEndpoints; n++) {
    let rowData = []
    let nextEndpoint = CURSOR_ENDPOINT_CORE

    nextEndpoint += `/cursor/endpoint-${n}`

    if (n === maxEndpoints) {
      nextEndpoint = null
    }
    for (let i = 1; i < 6; i++) {
      rowData = rowData.concat(createDataGroup(`${n}-${i}`))
    }
    mockData = {
      ...mockData,
      [currentEndpoint]: {
        data: rowData,
        meta: {
          nextEndpoint,
        },
      },
    }
    currentEndpoint = nextEndpoint
  }
  return mockData
}

const mockSuggestions = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

export {
  createData,
  createDataGroup,
  getMockData,
  getCursorMockData,
  mockSuggestions,
  getFatValueItems,
  getProteinValueItems,
  getDataForDifferentTypes,
  getFatItemsLocalization,
  getProteinItemsLocalization,
  getAutocomplete,
}
