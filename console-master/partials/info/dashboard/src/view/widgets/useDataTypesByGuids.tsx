import { DataEntities } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

export const useDataTypesByGuids = (guids: string[]) => {
  const {
    error: dataEntitiesByGuidsError,
    loading: dataEntitiesByGuidsLoading,
    data: dataEntitiesByGuidsList,
  } = useStatefulReduxQuery(DataEntities.queryDataEntitiesByGuids, { variables: { dataEntityGuids: guids } })

  return { dataEntitiesByGuidsList }
}
