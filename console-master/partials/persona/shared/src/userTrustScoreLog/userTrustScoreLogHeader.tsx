import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { PersonaScoreChartInterval, PersonaScoreType } from '@ues-data/persona'
import { theme } from '@ues/assets'

import type { UserTrustScoreEnabledModels } from './userTrustScoreLog.types'
import UserTrustScoreLogLegendItem from './userTrustScoreLogLegendItem'

interface UserTrustScoreLogHeaderPropTypes {
  enabledModels: UserTrustScoreEnabledModels
  interval: PersonaScoreChartInterval
  disabled: boolean
  onChangeModel: (model: PersonaScoreType) => (event: React.MouseEvent) => void
  onChangeInterval: (event: React.MouseEvent, newInterval: PersonaScoreChartInterval) => void
}

const UserTrustScoreLogHeader = ({
  enabledModels,
  interval,
  disabled,
  onChangeModel,
  onChangeInterval,
}: UserTrustScoreLogHeaderPropTypes) => {
  const { t } = useTranslation(['persona/common'])

  return (
    <Grid container>
      <Grid item container xs={12} data-autoid="trust-score-legends" justify="space-between">
        <Grid item lg={2} md={3} sm={3}>
          <UserTrustScoreLogLegendItem {...enabledModels[PersonaScoreType.TRUSTSCORE]} onChangeModel={onChangeModel} />
        </Grid>
        <Grid item xs={5} style={{ maxWidth: '270px' }}>
          <UserTrustScoreLogLegendItem {...enabledModels[PersonaScoreType.META]} onChangeModel={onChangeModel} />
          <Box mt={2} py={2} px={1} border={`1px solid ${theme.light.palette.grey[300]}`}>
            <Grid container justify="space-around">
              <Grid item>
                <UserTrustScoreLogLegendItem {...enabledModels[PersonaScoreType.KEYBOARD]} onChangeModel={onChangeModel} />
                <UserTrustScoreLogLegendItem {...enabledModels[PersonaScoreType.LOGON]} onChangeModel={onChangeModel} />
              </Grid>
              <Grid item>
                <UserTrustScoreLogLegendItem {...enabledModels[PersonaScoreType.MOUSE]} onChangeModel={onChangeModel} />
                <UserTrustScoreLogLegendItem {...enabledModels[PersonaScoreType.CONDUCT]} onChangeModel={onChangeModel} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item container lg={5} md={3} sm={3} justify="flex-end" alignItems="flex-end" style={{ minWidth: '141px' }}>
          <ToggleButtonGroup value={interval} exclusive onChange={onChangeInterval} size="small">
            <ToggleButton disabled={disabled} value={PersonaScoreChartInterval.Last30Days} data-autoid="toggle-button-last-30-days">
              <Typography variant="button">{t('LastNDays', { count: 30 })}</Typography>
            </ToggleButton>
            <ToggleButton
              disabled={disabled}
              value={PersonaScoreChartInterval.Last24Hours}
              data-autoid="toggle-button-last-24-hours"
            >
              <Typography variant="button">{t('LastNHrs', { count: 24 })}</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserTrustScoreLogHeader
