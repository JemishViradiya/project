import { useMemo } from 'react'

import type { PolicyFormValues } from '../model'
import { useRiskLevels } from './use-risk-levels'

export const useDefaultPolicyFormValues = (): PolicyFormValues => {
  const { riskLevels } = useRiskLevels()

  return useMemo(
    () => ({
      name: '',
      description: '',
      detections: riskLevels.map(riskLevelType => ({ riskLevel: riskLevelType, detections: [] })),
      automaticRiskReduction: { enabled: false },
    }),
    [riskLevels],
  )
}
