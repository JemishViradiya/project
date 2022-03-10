import moment from 'moment'
import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Hint, HorizontalBarSeries, HorizontalRectSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from 'react-vis'
import scrollIntoView from 'scroll-into-view-if-needed'

import { useTheme } from '@material-ui/core/styles'

import ClusterPopup from '../components/map/ClusterPopup'
import shorten from '../components/util/shorten'
import Placeholder from '../components/widgets/Placeholder'
import LatestEventsProvider from '../providers/LatestEventsProvider'
import PlaceholderEvents from '../static/PlaceholderEvents.svg'
import styles from './LatestEvents.module.less'

// stuff for automatically scrolling the popup into view if it's obscured
const canSmoothScroll = 'scrollBehavior' in document.body.style
const scrollOptions = {
  scrollMode: 'if-needed',
  block: 'nearest',
  inline: 'nearest',
  behavior: actions => {
    actions.forEach(ref => {
      const { el, top } = ref
      if (el.scroll && canSmoothScroll) {
        el.scroll({
          top,
          left: 0,
          behavior: 'auto',
        })
      } else {
        el.scrollTop = top
      }
    })
  },
  boundary: parent => {
    // FIXME: Probably come up with a better test for which element is allowed.
    return getComputedStyle(parent).overflow !== 'hidden scroll'
  },
}

// style-related sizes
const barWidth = 0.75
const heightPerBar = 35
const scrollBarAllowance = 30
const xaxisHeight = 36
const top = 25
const plotLeft = 45
const plotTop = 7
const scaleTop = 7
const tickTotal = 4
const labelAngle = -30
const scaleMargins = { top: scaleTop, bottom: 0, left: plotLeft }
const plotMargins = { top: plotTop, left: plotLeft }
const minimumMaxY = 10 // don't let the chart X-Axis get skinnier than this

// to make the highlight bar come out the same width as the stacked bars...
// half the width is 30 minutes = 1,800,000 ms
const rectHalfWidth = barWidth * 1800000

const chooseMax = (acc, v) => Math.max(acc, v.total)

const Graph = ({ width, height }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const context = useContext(LatestEventsProvider.Context)
  const [hoveredNode, setHoveredNode] = useState(null)
  const {
    palette: {
      bis: { risk: riskTheme },
    },
  } = useTheme()

  const [latestEvents, receivedData] = useMemo(() => {
    let latestEvents = []
    let receivedData = false
    if (context && context.data && context.data.latestEvents) {
      latestEvents = context.data.latestEvents
      receivedData = true
    }
    return [latestEvents, receivedData]
  }, [context])

  const onValueClick = useCallback(
    (n, ev) => {
      const event = ev.event
      event.preventDefault()
      event.stopPropagation()
      setHoveredNode(n)
    },
    [setHoveredNode],
  )
  const deselect = useCallback(
    ev => {
      ev.preventDefault()
      ev.stopPropagation()
      setHoveredNode(null)
    },
    [setHoveredNode],
  )

  // slightly different "click" behavior for each zone of the popup
  const [gotoCritical, gotoHigh, gotoMedium, gotoLow, gotoUnknown, gotoTotal] = useMemo(() => {
    const onClick = riskLevel => ev => {
      ev.preventDefault()
      ev.stopPropagation()
      const search = `?behavioralRiskLevel=${riskLevel}`
      navigate(`/events${riskLevel ? search : ''}`)
    }
    return [onClick('CRITICAL'), onClick('HIGH'), onClick('MEDIUM'), onClick('LOW'), onClick('UNKNOWN'), onClick(/* TOTAL */)]
  }, [navigate])

  // create chart data
  const [totalData, maxY, count, data] = useMemo(() => {
    const totalData = latestEvents.map(r => ({
      ...r,
      // convert the time to  the 1/2 hour to make the bars appear between hour ticks
      y: moment(r.datetime * 1000)
        .add(30, 'minutes')
        .valueOf(),
    }))
    const maxY = Math.max(totalData.reduce(chooseMax, 0), minimumMaxY)
    const count = totalData.length

    // plotting is a bit finicky.  We have to pull the buckets apart
    const data = {
      unknown: totalData.map(d => ({ y: d.y, x: d.total - d.low - d.medium - d.high - d.critical })),
      low: totalData.map(d => ({ y: d.y, x: d.low })),
      medium: totalData.map(d => ({ y: d.y, x: d.medium })),
      high: totalData.map(d => ({ y: d.y, x: d.high })),
      critical: totalData.map(d => ({ y: d.y, x: d.critical })),
      // we're going to write a transparent rectangle on top of the colored bars...
      total: totalData.map(d => ({ y: d.y - rectHalfWidth, y0: d.y + rectHalfWidth, x: d.total })),
    }

    return [totalData, maxY, count, data]
  }, [latestEvents])

  // @SIS-2144 --> have the popup scroll into view if it's obscured.
  // we need keep track of the ref to the DOM node in the popup to be able to ask it
  // to scroll into view.
  const [hintRef, setHintRef] = useState(null)
  useLayoutEffect(() => {
    if (!hintRef) return
    scrollIntoView(hintRef, scrollOptions)
  }, [hintRef, hoveredNode, totalData])

  const hint = useMemo(() => {
    if (!hoveredNode) return null
    const d = totalData.find(d => d.y > hoveredNode.y && d.y < hoveredNode.y0)
    return (
      <Hint value={{ y: d.y, x: 0 }}>
        <div ref={setHintRef}>
          <ClusterPopup summary={d} onClickFunctions={{ gotoCritical, gotoHigh, gotoMedium, gotoLow, gotoUnknown, gotoTotal }} />
        </div>
      </Hint>
    )
  }, [hoveredNode, totalData, gotoCritical, gotoHigh, gotoMedium, gotoLow, gotoUnknown, gotoTotal])

  const shorterLabel = useCallback(n => shorten(n, t), [t])

  // below, we have two copies of XYPlot --> the first is just to provide an X scale at the top
  // of the display, and the second provides the plots. Since it can easily extend below the bottom
  // of the dashboard widget, the 2nd XYPlot is wrapped in a scrollable <div>
  //
  // the HorizontalRectSeries is a trick for getting CSS highlighting of the stacked bar series
  // we draw it above the other series, but normally make it opaque (it still gets clicks)
  // with CSS, we can change the opacity to give a little bit of highlighting to the bar
  // we have to explicitly set the style for 3 elements to undefined -- otherwise rect-vis
  // sets these style properties directly on the drawn rectangles, completely overriding the
  // CSS we use for hover.
  const xyplot = useMemo(
    () => (
      <div data-testid="EventsGraph" onMouseLeave={deselect}>
        <XYPlot
          dontCheckIfEmpty
          width={width - scrollBarAllowance}
          height={xaxisHeight}
          xDomain={[0, maxY]}
          yDomain={[0, 0]}
          margin={scaleMargins}
        >
          <XAxis orientation="top" top={top} tickLabelAngle={labelAngle} tickTotal={tickTotal} tickFormat={shorterLabel} />
        </XYPlot>
        <div data-testid="GraphBody" style={{ width, height: height - xaxisHeight, overflowY: 'scroll', overflowX: 'hidden' }}>
          <XYPlot
            width={width - scrollBarAllowance}
            height={count * heightPerBar}
            xDomain={[0, maxY]}
            yType="time"
            stackBy="x"
            margin={plotMargins}
            onClick={deselect}
          >
            <VerticalGridLines top={0} tickTotal={tickTotal} />
            <YAxis hideLines tickTotal={count + 1} tickPadding={0} yType="time" />
            <HorizontalBarSeries stack barWidth={barWidth} data={data.unknown} color={riskTheme.unknown} />
            <HorizontalBarSeries stack barWidth={barWidth} data={data.low} color={riskTheme.low} />
            <HorizontalBarSeries stack barWidth={barWidth} data={data.medium} color={riskTheme.medium} />
            <HorizontalBarSeries stack barWidth={barWidth} data={data.high} color={riskTheme.high} />
            <HorizontalBarSeries stack barWidth={barWidth} data={data.critical} color={riskTheme.critical} />
            <HorizontalRectSeries
              className={styles.series}
              stack={false}
              data={data.total}
              onValueClick={onValueClick}
              style={{ opacity: undefined, stroke: undefined, fill: undefined }}
            />
            {hint}
          </XYPlot>
        </div>
      </div>
    ),
    [deselect, width, maxY, shorterLabel, height, count, data, riskTheme, onValueClick, hint],
  )

  const LatestEventsPlaceholder = () => (
    <Placeholder
      graphic={PlaceholderEvents}
      heading="dashboard.noLatestEvents"
      description="dashboard.noLatestEventsDescription"
      width={width}
      height={height}
    />
  )

  if (!data.total.some(bar => bar.x !== 0)) {
    // Prevent placeholder from flashing on page refresh
    if (receivedData) {
      return <LatestEventsPlaceholder />
    } else {
      return null
    }
  }

  return xyplot
}

// wrap the graph in a provider
const LatestEvents = ({ width, height }) => {
  if (!height || !width) return null

  return (
    <LatestEventsProvider>
      <Graph width={width} height={height} />
    </LatestEventsProvider>
  )
}

export default LatestEvents
