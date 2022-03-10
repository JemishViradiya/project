import React from 'react'
import { useSelector } from 'react-redux'

import { useTheme } from '@material-ui/core/styles'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { Gauge } from '@ues-behaviour/dashboard'
import { EppDashboardData } from '@ues-data/epp'
import type { UesTheme } from '@ues/assets'

import { getGaugeColor } from './widgets.utils'

const ThreatProtectionGauge = React.memo(
  ({ height }: ChartProps): JSX.Element => {
    const {
      tasks: { threatProtectionPercentage },
    }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

    const [value, setValue] = React.useState([{ value: 0 }])

    React.useEffect(() => {
      setTimeout(() => {
        setValue([{ value: threatProtectionPercentage.result }])
      }, 500)
    }, [threatProtectionPercentage.result])

    const theme = useTheme<UesTheme>()
    const color = getGaugeColor(threatProtectionPercentage.result, theme)

    return threatProtectionPercentage.loading ? null : <Gauge data={value} color={color} min={0} max={100} height={height} />
  },
)

export default ThreatProtectionGauge
