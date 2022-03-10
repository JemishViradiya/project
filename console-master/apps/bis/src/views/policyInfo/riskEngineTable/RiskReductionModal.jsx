import PropTypes from 'prop-types'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@material-ui/core'

import { Select } from '@ues-bis/shared'
import { RiskReduction } from '@ues-data/bis/model'

import { ConfirmationModal, RiskLevel } from '../../../shared'

const RiskReductionModal = memo(({ dialogId, value, onClose, onApply, riskLevels }) => {
  const { t } = useTranslation()
  const defaultValue = useRef(value)
  const [localValue, setLocalValue] = useState(value)
  const onChange = useCallback(event => {
    setLocalValue(event.target.value)
  }, [])
  const onConfirm = useCallback(() => {
    onApply(localValue)
  }, [localValue, onApply])
  const onCancel = useCallback(() => {
    setLocalValue(value)
    onClose()
  }, [onClose, value])

  useEffect(() => {
    if (defaultValue.current !== value) {
      defaultValue.current = value
      setLocalValue(value)
    }
  }, [value])

  const getRelatedReductionLevelComponent = useCallback(
    riskLevel => {
      switch (riskLevel) {
        case RiskLevel.CRITICAL:
          return (
            <MenuItem key={RiskReduction.CRITICAL} value={RiskReduction.CRITICAL}>
              {t(RiskLevel.label.CRITICAL)}
            </MenuItem>
          )
        case RiskLevel.HIGH:
          return (
            <MenuItem key={RiskReduction.HIGH} value={RiskReduction.HIGH}>
              {t(RiskLevel.label.HIGH)}
            </MenuItem>
          )
        case RiskLevel.MEDIUM:
          return (
            <MenuItem key={RiskReduction.MEDIUM} value={RiskReduction.MEDIUM}>
              {t('policies.details.riskReductionMediumMin')}
            </MenuItem>
          )
      }
    },
    [t],
  )

  const options = useMemo(() => {
    const defaultOptions = [
      <MenuItem key={RiskReduction.NONE} value={RiskReduction.NONE}>
        {t('policies.details.riskReductionNone')}
      </MenuItem>,
    ]

    const options = riskLevels.reduce((options, riskLevel) => {
      if (riskLevel !== RiskLevel.LOW) {
        options.push(getRelatedReductionLevelComponent(riskLevel))
      }
      return options
    }, [])
    return defaultOptions.concat(options.reverse())
  }, [t, getRelatedReductionLevelComponent, riskLevels])

  return (
    <ConfirmationModal
      dialogId={dialogId}
      title={t('policies.details.configureAutoRiskReductionTitle')}
      cancelLabel={t('common.cancel')}
      confirmLabel={t('common.apply')}
      onClose={onCancel}
      onConfirm={onConfirm}
    >
      <Select
        onChange={onChange}
        value={localValue}
        inputProps={{ 'data-testid': 'risk-reduction-modal-select' }}
        label={t('common.automaticRiskReduction')}
        labelId="risk-reduction-modal-select-label"
        fullWidth
        size="small"
      >
        {options}
      </Select>
    </ConfirmationModal>
  )
})

RiskReductionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
  value: PropTypes.oneOf(Object.values(RiskReduction)).isRequired,
  riskLevels: PropTypes.arrayOf(PropTypes.oneOf([RiskLevel.CRITICAL, RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW])),
}
RiskReductionModal.displayName = 'RiskReductionModal'

export default RiskReductionModal
