import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { RiskLevel } from '@ues-data/shared'

export const useLocalizedRiskLevels = () => {
  const { t } = useTranslation('bis/shared')
  return useMemo(() => {
    return {
      [RiskLevel.Secured]: t('bis/shared:risk.level.SECURED'),
      [RiskLevel.High]: t('bis/shared:risk.level.HIGH'),
      [RiskLevel.Medium]: t('bis/shared:risk.level.MEDIUM'),
      [RiskLevel.Low]: t('bis/shared:risk.level.LOW'),
    }
  }, [t])
}
