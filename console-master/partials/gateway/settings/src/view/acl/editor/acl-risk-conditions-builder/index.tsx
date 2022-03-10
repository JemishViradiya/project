//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box } from '@material-ui/core'

import { Components, Config, Data } from '@ues-gateway/shared'
import { RiskSlider } from '@ues/behaviours'

import { RiskSliderWrapper } from '../../../../components'

const { EntityDetailsViewContext } = Components
const { updateLocalAclRuleData, getInitialAclRuleRiskRange } = Data
const { DEFAULT_ACL_RULE_DATA } = Config

const AclRiskConditionsBuilder: React.FC = () => {
  const dispatch = useDispatch()
  const initialRiskRange = useSelector(getInitialAclRuleRiskRange)
  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  return (
    <RiskSliderWrapper>
      <RiskSlider
        withSecured={true}
        disabled={shouldDisableFormField}
        initialValue={[
          initialRiskRange?.min ?? DEFAULT_ACL_RULE_DATA.criteria.riskRange.min,
          initialRiskRange?.max ?? DEFAULT_ACL_RULE_DATA.criteria.riskRange.max,
        ]}
        onChange={(_, riskRange) => {
          const [min, max] = riskRange
          dispatch(updateLocalAclRuleData({ criteria: { riskRange: { min, max } } }))
        }}
      />
    </RiskSliderWrapper>
  )
}

export default AclRiskConditionsBuilder
