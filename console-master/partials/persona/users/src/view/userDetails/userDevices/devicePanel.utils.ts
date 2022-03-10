import orderBy from 'lodash-es/orderBy'
import moment from 'moment'

import type { PersonaModel } from '@ues-data/persona'
import { PersonaModelType } from '@ues-data/persona'

/**
 * If device lastEventTime is 5mins or more old
 * we consider device offline
 * @param lastEventTime
 */
export const isDeviceOffline = (lastEventTime: string) => moment().diff(moment(lastEventTime), 'minutes') > 5

/**
 * Generate key pattern based on params
 * @param arr array containing one or all PERSONA_SCORE_TYPES
 * @param deviceId associated device id
 */
export const generateKey = (models = [], str = '') => {
  const formattedModels = models.join('')

  return `${formattedModels}:${str}`
}

/**
 * Order PersonaModel items in proper way
 * @param {PersonaModel[]} models
 */
export const orderModels = (models: PersonaModel[]) => {
  if (models.length === 0) return []

  const processModel = models.find(({ modelType }) => modelType === PersonaModelType.CONDUCT)
  const metaModel = models.find(({ modelType }) => modelType === PersonaModelType.META)

  const filteredModels = models.filter(m => !(m.modelType === PersonaModelType.CONDUCT || m.modelType === PersonaModelType.META))

  return [metaModel, ...orderBy(filteredModels, 'modelType'), processModel]
}
