import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { RiskLevelTypes as RiskLevel, TrustLevel } from '@ues-data/bis/model'
import { StatusCritical, StatusHigh, StatusLow, StatusMedium } from '@ues/assets'

import { Icon } from './Icon'

interface RiskIconProps {
  size: string
  level: string
  className?: string
}

export const RiskIcon: React.FC<RiskIconProps> = memo(({ size, level, ...props }) => {
  const { t } = useTranslation()
  const {
    typography,
    palette: { bis },
  } = useTheme() as any
  const riskTheme = bis?.risk
  let fontSize = typography.subtitle1.fontSize
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (size) {
    case 'title':
      fontSize = typography.h2.fontSize
      break
  }
  let color
  let icon = StatusCritical
  switch (level) {
    case RiskLevel.CRITICAL:
    case TrustLevel.UNTRUSTED:
      color = riskTheme?.critical
      break
    case RiskLevel.HIGH:
      icon = StatusHigh
      color = riskTheme?.high
      break
    case RiskLevel.MEDIUM:
      icon = StatusMedium
      color = riskTheme?.medium
      break
    case RiskLevel.LOW:
      icon = StatusLow
      color = riskTheme?.low
      break
    case TrustLevel.TRUSTED:
      color = riskTheme?.low
      icon = StatusLow
      break
    case RiskLevel.UNKNOWN:
    default:
      color = riskTheme?.unknown
      break
  }
  const style = useMemo(() => ({ fontSize, color }), [fontSize, color])
  const title = t(`risk.status.${level}`)
  return <Icon aria-label={title} title={title} icon={icon} style={style} {...props} />
})

export default RiskIcon
