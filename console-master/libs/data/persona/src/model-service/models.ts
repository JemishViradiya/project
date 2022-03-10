import type { Response } from '@ues-data/shared-types'

import { axiosInstance, personaModelsBaseUrl } from '../config.rest'
import { paramsSerializer } from '../utils'
import type ModelInterface from './model-interface'
import type { GetPersonaModelsParams, PersonaModel, UpdatePersonaModelsParams } from './models-types'

class ModelsClass implements ModelInterface {
  getPersonaModels(params: GetPersonaModelsParams): Response<PersonaModel[]> {
    return axiosInstance().get(personaModelsBaseUrl, { params, paramsSerializer })
  }
  updatePersonaModel(params: UpdatePersonaModelsParams): Response<unknown> {
    return axiosInstance().post(`${personaModelsBaseUrl}/status`, params)
  }
}

const ModelsApi = new ModelsClass()

export { ModelsApi }
