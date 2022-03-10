import React from 'react'

import { Card, makeStyles } from '@material-ui/core'

import { RiskLevel } from '@ues-data/shared'
import { RiskChips as RiskChipsComponent } from '@ues/behaviours'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: theme.spacing(4),
    maxWidth: 350,
  },
}))

export const RiskChips = () => {
  const classes = useStyles()

  return (
    <Card className={classes.container}>
      <RiskChipsComponent value={[RiskLevel.Low]} />
      <RiskChipsComponent value={[RiskLevel.Low, RiskLevel.High]} />
      <RiskChipsComponent value={[RiskLevel.Medium, RiskLevel.High]} />
      <RiskChipsComponent value={[RiskLevel.Low, RiskLevel.Medium, RiskLevel.High]} />
      <RiskChipsComponent value={[RiskLevel.Secured, RiskLevel.Low, RiskLevel.Medium, RiskLevel.High]} />
    </Card>
  )
}
