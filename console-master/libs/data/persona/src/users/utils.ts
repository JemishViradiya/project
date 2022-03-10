import type { UpdatePersonaModelsParams } from '../model-service/models-types'

export const getUpdatePersonaModelTaskKey = ({ deviceId, command, models }: Partial<UpdatePersonaModelsParams>) => {
  const isBulkRequest = models.length > 1

  return isBulkRequest ? `${deviceId}:${command}` : `${deviceId}:${models[0]}:${command}`
}
