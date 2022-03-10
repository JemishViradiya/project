import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SensitiveFilesOnEndpointsResponse } from '@ues-data/dlp'
import { usePrevious } from '@ues-data/shared'

import { useDataTypesByGuids } from './useDataTypesByGuids'
import { usePolicyByGuids } from './usePolicyByGuids'

const POLICY_SENSITIVE_DATA = 0
const DATA_TYPES_SENSITIVE_DATA = 3

export const useSensitiveData = (data: SensitiveFilesOnEndpointsResponse, tabIndex: number) => {
  const [dataTypesGuids, setDataTypesGuids] = useState([])
  const [policyGuids, setPolicyGuids] = useState([])
  const { dataEntitiesByGuidsList } = useDataTypesByGuids(dataTypesGuids)
  const { policiesByGuidsList } = usePolicyByGuids(policyGuids)
  const [sensitiveData, setSensitiveData] = useState([])
  const { t } = useTranslation(['general/form'])
  const dataFiles = useMemo(
    () =>
      data?.items.map(file => ({
        count: file.count,
        label: !file.item ? t('commonLabels.unknown') : file.item,
      })),
    [data?.items, t],
  )
  const guidsByLabels = data?.items?.map(i => i?.item)
  const prevGuidsByLabels = usePrevious(guidsByLabels)

  useEffect(
    () => {
      if (tabIndex === POLICY_SENSITIVE_DATA && !prevGuidsByLabels && guidsByLabels) {
        return setPolicyGuids(guidsByLabels)
      } else if (tabIndex === DATA_TYPES_SENSITIVE_DATA && !prevGuidsByLabels && guidsByLabels) {
        return setDataTypesGuids(guidsByLabels)
      }
      return setSensitiveData(dataFiles)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabIndex, dataFiles],
  )

  useEffect(
    () => {
      if (dataEntitiesByGuidsList) {
        const dataTypes = dataEntitiesByGuidsList?.map(item => {
          return {
            count: dataFiles?.find(entity => entity.label === item.guid)?.count,
            label: item.name,
            guid: dataFiles?.find(entity => entity.label === item.guid)?.label,
          }
        })
        setSensitiveData(dataTypes)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataEntitiesByGuidsList],
  )

  useEffect(
    () => {
      if (policiesByGuidsList) {
        const policies = policiesByGuidsList?.elements?.map(item => {
          return {
            count: dataFiles?.find(entity => entity.label === item.policyId)?.count,
            label: item.policyName,
            guid: dataFiles?.find(entity => entity.label === item.policyId)?.label,
          }
        })
        setSensitiveData(policies)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [policiesByGuidsList],
  )
  const sensitiveDataItems = useMemo(() => sensitiveData?.slice(0, 10) ?? [], [sensitiveData])
  return { sensitiveDataItems }
}
