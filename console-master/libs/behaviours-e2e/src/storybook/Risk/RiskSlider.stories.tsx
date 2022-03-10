import React, { useEffect, useState } from 'react'

import { Card, makeStyles } from '@material-ui/core'

import { RiskLevel } from '@ues-data/shared'
import type { RiskRangeValue } from '@ues/behaviours'
import { RiskSlider as RiskSliderComponent } from '@ues/behaviours'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: 350,
  },
}))

export const RiskSlider = ({ withSecured }: { disabled: boolean; withSecured?: boolean }) => {
  const classes = useStyles()
  const [initialValue, setInitialValue] = useState<RiskLevel[] | [RiskRangeValue, RiskRangeValue]>([RiskLevel.Low, RiskLevel.High])
  const [riskRange, setRiskRange] = useState<[RiskRangeValue, RiskRangeValue]>()

  useEffect(() => {
    if (withSecured) {
      setInitialValue([RiskLevel.Low, RiskLevel.High])
    }
  }, [withSecured])

  return (
    <Card className={classes.container}>
      <RiskSliderComponent
        key={`${withSecured}`}
        withSecured={withSecured}
        initialValue={initialValue}
        onChange={(_risk, riskRange) => setRiskRange(riskRange)}
      />
    </Card>
  )
}

RiskSlider.args = {
  withSecured: false,
}
RiskSlider.argTypes = {
  withSecured: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: false },
  },
}
