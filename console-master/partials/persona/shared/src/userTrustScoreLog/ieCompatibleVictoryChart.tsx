import React from 'react'
import { VictoryChart, VictoryContainer } from 'victory'
import type { VictoryChartProps } from 'victory-chart'

import { makeStyles } from '@material-ui/core/styles'

const useIEChartStyles = makeStyles({
  chartWrapper: {
    position: 'relative',
    paddingBottom: `70%`,
  },
  // Needed to properly position tooltips in IE11
  victoryContainer: {
    '& > div': {
      height: '100% !important',
    },
  },
})

const IECompatibleVictoryChart = (props: VictoryChartProps) => {
  const classes = useIEChartStyles()
  return (
    <div className={classes.chartWrapper}>
      <VictoryChart
        {...props}
        style={{
          parent: {
            position: 'absolute',
            height: '100%',
            width: '100%',
          },
        }}
        containerComponent={<VictoryContainer className={classes.victoryContainer} />}
      />
    </div>
  )
}

export default IECompatibleVictoryChart
