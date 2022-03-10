import { v4 as uuidv4 } from 'uuid'

import type { PersonaModel } from './models-types'
import { PersonaModelStatus, PersonaModelType } from './models-types'

const createModel = (id: string, type: PersonaModelType, status: PersonaModelStatus): PersonaModel => ({
  id,
  modelType: type,
  status: status,
})

export const GetPersonaModelsResponseMock: PersonaModel[] = [
  createModel(uuidv4(), PersonaModelType.META, PersonaModelStatus.TRAINING),
  createModel(uuidv4(), PersonaModelType.CONDUCT, PersonaModelStatus.SCORING),
  createModel(uuidv4(), PersonaModelType.KEYBOARD, PersonaModelStatus.TRAINING),
  createModel(uuidv4(), PersonaModelType.MOUSE, PersonaModelStatus.PAUSED),
  createModel(uuidv4(), PersonaModelType.NETWORK, PersonaModelStatus.PAUSED),
  createModel(uuidv4(), PersonaModelType.LOGON, PersonaModelStatus.SCORING),
]
