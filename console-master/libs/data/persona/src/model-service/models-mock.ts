import type { Response } from '@ues-data/shared-types'

import type ModelInterface from './model-interface'
import { GetPersonaModelsResponseMock } from './models-mock.data'
import type { GetPersonaModelsParams, PersonaModel, UpdatePersonaModelsParams } from './models-types'

class ModelsMockClass implements ModelInterface {
  getPersonaModels(params: GetPersonaModelsParams): Response<PersonaModel[]> {
    console.log('ModelsMockApi -> getPersonaModels', { params })
    return Promise.resolve({ data: GetPersonaModelsResponseMock })
  }
  updatePersonaModel(params: UpdatePersonaModelsParams): Response<unknown> {
    console.log('ModelsMockApi -> updatePersonaModel', { params })
    return Promise.resolve({})
  }
}

const ModelsMockApi = new ModelsMockClass()

export { ModelsMockApi }
