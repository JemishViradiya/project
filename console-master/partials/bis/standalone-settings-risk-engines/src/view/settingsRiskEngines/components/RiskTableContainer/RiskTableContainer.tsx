import React, { memo, useCallback } from 'react'
import { Controller } from 'react-hook-form'

import { makeStyles } from '@material-ui/core'

import { RiskEnginesSlider, RiskLevelSelect } from '@ues-bis/shared'
import { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

import RiskEnginesSettingTable from './../RiskEnginesSettingTable'

const useStyles = makeStyles(() => ({
  riskFactorText: {
    width: '310px',
  },
}))

interface RiskTableContainerProps {
  canEdit: boolean
  selectOptions: any
  rangePath: any
  riskLevelPath: any
  riskFactorText: any
}

const RiskTableContainer: React.FC<RiskTableContainerProps> = memo(
  ({ canEdit, selectOptions, rangePath, riskLevelPath, riskFactorText }) => {
    const styles = useStyles()

    const renderSlider = useCallback(
      ({ onChange, value }) => (
        <RiskEnginesSlider onChange={onChange} value={value} disabled={!canEdit} riskLevelPath={riskLevelPath} />
      ),
      [canEdit, riskLevelPath],
    )

    const renderRiskLevelSelect = useCallback(
      ({ onChange, value, name }) => (
        <RiskLevelSelect
          labelId={`ip-address-settings-risk-level-select-label-${riskLevelPath}`}
          name={name}
          onChange={onChange}
          value={value}
          disabled={!canEdit}
          options={selectOptions}
        />
      ),
      [canEdit, riskLevelPath, selectOptions],
    )

    return (
      <RiskEnginesSettingTable>
        <>
          <p className={styles.riskFactorText}>{riskFactorText}</p>
          <Controller render={renderSlider} name={rangePath} />
          <Controller render={renderRiskLevelSelect} name={riskLevelPath} />
        </>
      </RiskEnginesSettingTable>
    )
  },
)

export default RiskTableContainer
