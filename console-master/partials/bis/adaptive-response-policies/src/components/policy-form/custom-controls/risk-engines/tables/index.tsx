import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'

import { deleteAction } from '../../../../../utils'
import IdentityAndBehaviorTable from './IdentityAndBehavior.jsx'

let riskEngineTableId = 1
const riskEngineSymbol = Symbol('RiskEngineTableId').toString()

const RiskEngineSection = memo<any>(
  ({
    title,
    subtitle,
    component: Component,
    onDataChange,
    policyData,
    actionState,
    onDeleteActionClick,
    onFactorChange,
    canEdit,
    riskLevels,
    riskFactors,
  }) => {
    const self = useRef<string>()
    if (!self.current) {
      self.current = `${riskEngineSymbol}-${riskEngineTableId++}`
    }
    return (
      Component && (
        <>
          <Typography variant="body2">{subtitle}</Typography>
          <Component
            onDataChange={onDataChange}
            onDeleteActionClick={onDeleteActionClick}
            onFactorChange={onFactorChange}
            policyData={policyData}
            canEdit={canEdit}
            actionState={actionState}
            riskLevels={riskLevels}
            riskFactors={riskFactors}
          />
        </>
      )
    )
  },
)

RiskEngineSection.displayName = 'RiskEngineSection'

const reduceFactors = factors =>
  factors.reduce((pre, curr) => {
    if (curr.checked) {
      pre.push(curr.id)
    }
    return pre
  }, [])

const identitySettings = 'identityPolicy'

export const RiskEngineTablesContainer = ({
  onChange: onDataChange,
  value: policyData,
  actionState,
  riskLevels,
  riskFactors,
  readOnly,
}) => {
  const { t } = useTranslation(['bis/ues', 'bis/shared'])

  const handleDeleteActionClick = useCallback(
    (actionsAccessor, index) => {
      onDataChange(deleteAction(policyData, actionsAccessor, index))
    },
    [policyData, onDataChange],
  )

  const handleFactorChange = useCallback(
    settingsType => factors => {
      const riskFactors = reduceFactors(factors)
      const newData = {
        ...policyData,
        [settingsType]: {
          ...(policyData[settingsType] ?? {}),
          riskFactors,
          // below handles scenario when user enables IP address risk factor on previously created policy without this risk factor
        },
      }
      onDataChange(newData)
    },
    [onDataChange, policyData],
  )

  const [identityFactorChangeHandler] = useMemo(() => [handleFactorChange(identitySettings)], [handleFactorChange])

  // const identityRiskEnabled = isIdentityRiskEnabled(settings, NetworkAnomalyDetection)
  const identityRiskEnabled = true

  return useMemo(() => {
    return (
      identityRiskEnabled && (
        <RiskEngineSection
          policyData={policyData}
          title={t('bis/shared:risk.common.identityRisk')}
          subtitle={t('policies.details.addCustomActionRiskFactors')}
          component={IdentityAndBehaviorTable}
          actionState={actionState}
          onDeleteActionClick={handleDeleteActionClick}
          onFactorChange={identityFactorChangeHandler}
          onDataChange={onDataChange}
          canEdit={!readOnly}
          riskLevels={riskLevels}
          riskFactors={riskFactors}
        />
      )
    )
  }, [
    identityRiskEnabled,
    policyData,
    t,
    actionState,
    handleDeleteActionClick,
    identityFactorChangeHandler,
    onDataChange,
    readOnly,
    riskLevels,
    riskFactors,
  ])
}
