export enum PersonaModelType {
  META = 'META',
  CONDUCT = 'CONDUCT',
  KEYBOARD = 'KEYBOARD',
  MOUSE = 'MOUSE',
  NETWORK = 'NETWORK',
  LOGON = 'LOGON',
}

export enum PersonaModelStatus {
  TRAINING = 'TRAINING',
  SCORING = 'SCORING',
  PAUSED = 'PAUSED',
}

export enum PersonaModelCommand {
  RESUME = 'RESUME',
  PAUSE = 'PAUSE',
  RESET = 'RESET',
}

export interface PersonaModel {
  id: string
  modelType: PersonaModelType
  status: PersonaModelStatus
}

export interface GetPersonaModelsParams {
  userId: string
  deviceId: string
}

export interface UpdatePersonaModelsParams {
  userId: string
  deviceId: string
  models: PersonaModelType[]
  command: PersonaModelCommand
}
