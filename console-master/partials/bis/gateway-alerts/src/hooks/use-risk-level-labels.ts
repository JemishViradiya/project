import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { RiskLevelTypes } from '@ues-data/bis/model'

export const useLocalizedRiskLevels = () => {
  const { t } = useTranslation('bis/shared')
  return useMemo(() => {
    return {
      [RiskLevelTypes.CRITICAL]: t('bis/shared:risk.level.CRITICAL'),
      [RiskLevelTypes.HIGH]: t('bis/shared:risk.level.HIGH'),
      [RiskLevelTypes.MEDIUM]: t('bis/shared:risk.level.MEDIUM'),
      [RiskLevelTypes.LOW]: t('bis/shared:risk.level.LOW'),
    }
  }, [t])
}
