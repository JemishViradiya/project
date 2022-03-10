import { useMemo } from 'react'

import type { RiskLevel } from '@ues-data/shared'
import { useFeatures } from '@ues-data/shared'

import { DETECTIONS_CONFIG, RISK_LEVELS_LIST } from '../config/detections'

export const useRiskLevels = () => {
  const { isEnabled } = useFeatures()

  const riskLevelsSet = useMemo(
    () =>
      new Set(
        Object.keys(
          Object.values(DETECTIONS_CONFIG).reduce<Partial<Record<RiskLevel, boolean>>>(
            (mainAcc, { applicableRiskLevels = new Set(), features = [] }) => {
              if (features.some(feature => !isEnabled(feature))) {
                return mainAcc
              }

              return {
                ...mainAcc,
                ...Array.from(applicableRiskLevels).reduce<Partial<Record<RiskLevel, boolean>>>(
                  (configAcc, level) => ({ ...configAcc, [level]: true }),
                  {},
                ),
              }
            },
            {},
          ),
        ) as RiskLevel[],
      ),
    [isEnabled],
  )

  const riskLevels = useMemo(() => RISK_LEVELS_LIST.filter(level => riskLevelsSet.has(level)), [riskLevelsSet])

  return { riskLevelsSet, riskLevels }
}
