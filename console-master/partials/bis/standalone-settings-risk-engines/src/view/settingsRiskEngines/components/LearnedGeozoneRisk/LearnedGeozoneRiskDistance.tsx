import React, { memo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'

import { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

import RiskSettingLabel from '../RiskSettingLabel'
import RiskDistanceInputContainer from './RiskDistanceInputContainer'

const useStyles = makeStyles(() => ({
  riskTable: {
    marginTop: 13,
  },
  riskLabelWrapper: {
    padding: '5px 20px',
  },
}))

interface LearnedGeozoneRiskDistanceProps {
  settings: any
  disabled: boolean
}

const LearnedGeozoneRiskDistance: React.FC<LearnedGeozoneRiskDistanceProps> = memo(({ settings, disabled }) => {
  const { t } = useTranslation()
  const styles = useStyles()
  const { watch } = useFormContext()

  return (
    <div className={styles.riskTable}>
      {settings.map(risk => (
        <RiskSettingLabel
          riskText={risk.text}
          key={risk.key}
          level={risk.key}
          customClass={risk.key !== RiskLevel.HIGH && styles.riskLabelWrapper}
        >
          {risk.key !== RiskLevel.HIGH ? (
            <RiskDistanceInputContainer
              valueFieldName={risk.valueFieldName}
              unitFieldName={risk.unitFieldName}
              riskKey={risk.key}
              disabled={disabled}
            />
          ) : (
            t('settings.riskEngines.learnedGeozoneDistanceMoreThan', {
              valueOuterField: watch(risk.valueFieldName),
              unitOuterField: watch(risk.unitFieldName),
            })
          )}
        </RiskSettingLabel>
      ))}
    </div>
  )
})

export default LearnedGeozoneRiskDistance
