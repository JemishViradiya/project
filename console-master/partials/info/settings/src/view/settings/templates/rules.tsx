import { DATA_TYPES, STATUS } from '@ues-data/dlp'

export const isAddable = row => {
  //console.log('isAdditable = ', row, row.type, DATA_TYPES[row.type])
  return DATA_TYPES[row.type] === DATA_TYPES.PREDEFINED
}
export const isRemovable = row => DATA_TYPES[row.type] === DATA_TYPES.PREDEFINED
export const isDeletable = row => DATA_TYPES[row.type] === DATA_TYPES.CUSTOM
