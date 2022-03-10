import PropTypes from 'prop-types'
import { memo, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { uniqueValues } from '@ues-bis/shared'

import { Context as RiskEnginesSettingsProviderContext } from '../providers/RiskEngineSettingsProvider'
import { IdentityRiskLevel, Label, RiskLevel } from './RiskLevel'

const BehavioralPatternRiskInfo = memo(({ score, level, showWithScore }) => {
  const { data } = useContext(RiskEnginesSettingsProviderContext)
  const { t } = useTranslation()
  const hasScore = score >= 0

  const riskLevel = RiskLevel.behavioralEngineBasedRiskLevel(score, level, data?.behavioral?.riskLevels)
  const riskLevelText = t(Label[riskLevel])
  const riskScoreText = `${Math.round(score)}%`
  if (showWithScore) {
    const text = `${t('risk.common.behavioralPatternRiskScore')}: `
    if (hasScore) {
      return `${text}${riskScoreText} (${riskLevelText})`
    }
    return `${text}${riskLevelText}`
  }
  return riskLevel === RiskLevel.TRAINING || !hasScore ? riskLevelText : riskScoreText
})

BehavioralPatternRiskInfo.displayName = 'BehavioralPatternRiskInfo'

BehavioralPatternRiskInfo.propTypes = {
  score: PropTypes.number,
  level: PropTypes.oneOf(uniqueValues([...Object.values(IdentityRiskLevel), RiskLevel.TRAINING])),
  showWithScore: PropTypes.bool,
}

export default BehavioralPatternRiskInfo
