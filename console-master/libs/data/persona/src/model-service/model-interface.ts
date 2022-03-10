import type { Response } from '@ues-data/shared-types'

import type { GetPersonaModelsParams, PersonaModel, UpdatePersonaModelsParams } from './models-types'

export default interface ModelInterface {
  /**
   * Get Persona Models list for specific user device
   * @param  {GetPersonaModelsParams} params
   */
  getPersonaModels(params: GetPersonaModelsParams): Response<PersonaModel[]>

  /**
   * Change status of multiple Persona Models for specific user device
   * @param  {UpdatePersonaModelsParams} params
   */
  updatePersonaModel(params: UpdatePersonaModelsParams): Response
}
