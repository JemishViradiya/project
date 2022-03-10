import 'react-vis/dist/style.css'

import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState } from 'react'
import { HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis } from 'react-vis'

const minimumMaxY = 10

const defaultSize = 300
const selectedLineWith = 4
const marginLeft = { left: 60 }
const linePointerEvents = { pointerEvents: 'visibleStroke' }

const LineChart = ({ onLineSelected, width = defaultSize, height = defaultSize, start, end, yMax, data }) => {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const onClick = useCallback(
    ev => {
      if (selectedIndex !== null && onLineSelected) {
        onLineSelected(ev, data[selectedIndex])
      }
    },
    [selectedIndex, onLineSelected, data],
  )

  const dataLength = data.length
  const onMouseOver = useMemo(() => {
    const funcs = []
    for (let i = 0; i < dataLength; i++) {
      funcs.push(() => {
        setSelectedIndex(i)
      })
    }
    return funcs
  }, [dataLength, setSelectedIndex])

  const onMouseLeave = useCallback(() => setSelectedIndex(null), [setSelectedIndex])

  const lines = () =>
    data.map((series, idx) => {
      return (
        <LineSeries
          key={`line-series-${idx}`}
          data={series.data}
          color={series.color}
          onSeriesMouseOver={onMouseOver[idx]}
          style={linePointerEvents}
        />
      )
    })

  const highlight = () => {
    if (selectedIndex === null) {
      return
    }
    const series = data[selectedIndex]
    return (
      <LineSeries
        data={series.data}
        color={series.color}
        onSeriesMouseOut={onMouseLeave}
        strokeWidth={selectedLineWith}
        style={linePointerEvents}
      />
    )
  }

  return (
    <XYPlot
      margin={marginLeft}
      xType="time"
      xDomain={[start, end]}
      yDomain={[0, Math.max(yMax, minimumMaxY)]}
      width={width}
      height={height}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    >
      <HorizontalGridLines />
      <XAxis xType="time" tickLabelAngle={-30} />
      <YAxis />
      {lines()}
      {highlight()}
    </XYPlot>
  )
}

LineChart.propTypes = {
  onLineSelected: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  yMax: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.instanceOf(Date).isRequired,
          y: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
}

export default LineChart
