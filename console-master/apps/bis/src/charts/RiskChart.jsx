import 'react-vis/dist/style.css'

import debounce from 'lodash-es/debounce'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Crosshair,
  Hint,
  HorizontalGridLines,
  LabelSeries,
  LineSeries,
  MarkSeries,
  VerticalGridLines,
  VerticalRectSeries,
  XAxis,
  XYPlot,
} from 'react-vis'

import { getRelativeRange } from '../components/util/DateHelper'
import styles from './RiskChart.module.less'

const MS_OF_25_HOURS = 90000000
const MS_OF_DEBOUNCE = 200

export class RiskChart extends PureComponent {
  state = {
    drawCrosshair: false,
    focused: false,
    hintOn: false,
    mouseOver: false,
  }

  getCrosshairValues = data => {
    const midX = Math.round((data.x + data.x0) * 0.5)
    return [{ ...data, x: midX }]
  }

  renderCrosshair = () => {
    if (this.props.riskData && this.props.riskData.length > 0 && this.state.drawCrosshair) {
      const data = this.state.crosshairValues[0]
      let style = { line: { background: this.props.theme.palette.bis.risk.mark } }
      if (data.x0 === this.props.riskData[0].x0) {
        style = { line: { width: 0 } }
      }
      return (
        <Crosshair values={this.state.crosshairValues} style={style}>
          <div />
        </Crosshair>
      )
    }
    return null
  }

  getTimeLabel = data => {
    const eventTime = moment(data.riskEvent.assessment.datetime)
    if (moment(0, 'H').diff(eventTime) <= 0) {
      return eventTime.format('h:mm a')
    } else {
      return eventTime.format('MMM Do, h:mm a')
    }
  }

  renderMark = (RiskChartMaxAxisY, RiskChartMarkStrokeWidth) => {
    if (!this.props.riskData || this.props.riskData.length === 0) {
      return null
    }
    const data = this.props.riskData[0]
    const markData = [{ ...data, x: data.x0, y: this.props.theme.custom.bisRiskChart.mark.circleOffsetY, opacity: 1 }]
    const lineData = [...markData, { ...data, x: data.x0, y: RiskChartMaxAxisY, opacity: 1 }]
    const labelDataTime = [
      {
        ...markData[0],
        xOffset: 0,
        yOffset: this.props.theme.custom.bisRiskChart.mark.labelOffsetY,
        label: this.getTimeLabel(data),
      },
    ]

    const markColor = data.color
    return [
      <LineSeries key="mark-line" data={lineData} color={markColor} strokeWidth={RiskChartMarkStrokeWidth} />,
      <MarkSeries
        key="mark-dot"
        size={this.props.theme.custom.bisRiskChart.mark.circleSize}
        fill="white"
        stroke={markColor}
        strokeWidth={RiskChartMarkStrokeWidth}
        style={{ pointerEvents: 'none' }}
        data={markData}
      />,
      <LabelSeries
        key="mark-label-time"
        className={styles.markLabel}
        data={labelDataTime}
        labelAnchorX="middle"
        style={{ fill: markColor }}
      />,
    ]
  }

  createTickValues = (start, end, max, unit) => {
    if (start > end) {
      console.error('the tick start time is later than the end time', start, end)
      return []
    }
    const unitValue = moment.duration({ [unit]: 1 }).valueOf()
    const interval = moment.duration({ [unit]: Math.ceil((end - start) / ((max + 1) * unitValue)) })

    // Adding moment's duration to correct daylight adjustment.
    const tickValues = []
    let tick = moment(start).add(interval).startOf(unit)
    while (tick.valueOf() < end) {
      tickValues.push(tick.valueOf())
      tick = tick.add(interval)
    }
    return tickValues
  }

  getTickValues = (start, end) => {
    const max = Math.max(
      this.props.theme.custom.bisRiskChart.tick.defaultMax,
      Math.floor(this.props.width / this.props.theme.custom.bisRiskChart.tick.minWidth),
    )
    let tickValues = []
    if (end - start < MS_OF_25_HOURS) {
      this.tickUnit = 'hour'
    } else {
      this.tickUnit = 'day'
    }
    tickValues = this.createTickValues(start, end, max, this.tickUnit)
    return tickValues
  }

  getTickFormat = value => {
    if (this.tickUnit === 'hour') {
      return moment(value).format('ha')
    } else {
      return moment(value).format('MMM D')
    }
  }

  onRiskValueOver = (current, { event }) => {
    const oldHighlightId = this.state.highlight ? this.state.highlight.id : ''
    if (current.riskEvent.id !== oldHighlightId && this.props.onHighlightChanged) {
      this.props.onHighlightChanged(current.riskEvent)
    }
    this.setState({
      drawCrosshair: false,
      crosshairValues: this.getCrosshairValues(current),
      current,
      highlight: current.riskEvent,
      mouseOver: true,
    })
    event.target.addEventListener('mousemove', this.handleHighlightMouseMove)
  }

  onRiskValueOut = (_, { event }) => {
    event.target.removeEventListener('mousemove', this.handleHighlightMouseMove)
    if (this.props.onHighlightChanged) {
      this.props.onHighlightChanged()
    }
    this.setState({ hintOn: false, highlight: undefined, mouseOver: false })
  }

  onNearestX = debounce(
    (_, { index }) => {
      if (this.state.mouseOver || !this.state.focused) {
        return
      }
      const data = this.props.chartData[0][index]
      if (data !== this.state.current) {
        this.setState({
          drawCrosshair: true,
          crosshairValues: this.getCrosshairValues(data),
          current: data,
        })
      }
    },
    MS_OF_DEBOUNCE,
    { leading: true, maxWait: MS_OF_DEBOUNCE },
  )

  renderRiskBar = () => {
    if (this.props.chartData[0]) {
      return (
        <VerticalRectSeries
          className={styles.bar}
          data={this.props.chartData[0]}
          colorType="literal"
          onNearestX={this.onNearestX}
          onValueMouseOver={this.onRiskValueOver}
          onValueMouseOut={this.onRiskValueOut}
        />
      )
    }
    return null
  }

  renderRisk = () => {
    if (this.props.chartData[1]) {
      return <VerticalRectSeries className={styles.bar} data={this.props.chartData[1]} colorType="literal" />
    }
    return null
  }

  handleHighlightMouseMove = e => {
    if (this.hint) {
      this.hint.style.top = `${e.clientY + this.props.theme.custom.bisRiskChart.hint.offsetY}px`
      this.hint.style.left = `${e.clientX}px`
      this.setState({ hintOn: true })
    }
  }

  renderHint = () => {
    const current = this.state.current
    if (this.state.highlight && current) {
      const riskLevelKey = `risk.level.${current.riskEvent.assessment.behavioralRiskLevel}`
      const content = `${this.getTimeLabel(current)} - ${this.props.t(riskLevelKey)}`
      const hide = this.state.hintOn ? '' : styles.hide
      return (
        <Hint value={current}>
          <div className={`${styles.hint} ${hide}`}>
            <span ref={ref => (this.hint = ref)}>{content}</span>
          </div>
        </Hint>
      )
    }
    return null
  }

  getXDomain = range => {
    const domain = {
      X2: moment().endOf('hour').valueOf(),
    }
    if (range.last) {
      domain.X1 = getRelativeRange(range.last)
    } else {
      domain.X1 = range.start * 1000
      if (range.end) {
        domain.X2 = range.end * 1000
      }
    }
    // Adjustment for better bar display.
    if (this.props.chartData[0] && this.props.chartData[0].length > 0) {
      domain.X1 = Math.min(this.props.chartData[0][0].x0, domain.X1)
      domain.X2 = Math.max(this.props.chartData[0][this.props.chartData[0].length - 1].x, domain.X2)
    }
    return domain
  }

  onMouseDown = () => {
    if (this.state.current) {
      this.props.onRiskEventSelected(this.state.current.riskEvent)
    }
  }

  onMouseEnter = () => {
    this.setState({ focused: true })
  }

  onMouseLeave = () => {
    if (this.props.onHighlightChanged && this.state.highlight) {
      this.props.onHighlightChanged()
    }
    this.setState({ focused: false, drawCrosshair: false, hintOn: false, highlight: undefined, mouseOver: false })
  }

  render() {
    const xDomain = this.getXDomain(this.props.range)
    const ColorNavLink = this.props.theme.palette.grey['300']
    const RiskChartMaxAxisY = this.props.theme.custom.bisRiskChart.chart.maxAxisY
    const RiskChartGridStrokeWidth = this.props.theme.custom.bisRiskChart.grid.strokeWidth
    const RiskChartMarkStrokeWidth = this.props.theme.custom.bisRiskChart.mark.strokeWidth
    const tickValues = this.getTickValues(xDomain.X1, xDomain.X2)
    return (
      <XYPlot
        className={styles.chart}
        dontCheckIfEmpty
        width={this.props.width}
        height={this.props.height}
        margin={{
          left: this.props.theme.custom.bisRiskChart.chart.marginLeft,
          right: this.props.theme.custom.bisRiskChart.chart.marginRight,
          bottom: this.props.theme.custom.bisRiskChart.chart.marginBottom,
        }}
        xType="time"
        xDomain={[xDomain.X1, xDomain.X2]}
        yDomain={[0, RiskChartMaxAxisY]}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <XAxis
          tickSize={0}
          tickValues={tickValues}
          tickFormat={this.getTickFormat}
          style={{ line: { display: 'none' }, text: { fill: ColorNavLink, fontSize: this.props.theme.typography.bis.smallest } }}
        />
        <VerticalGridLines
          tickValues={tickValues}
          style={{
            fill: ColorNavLink,
            strokeWidth: RiskChartGridStrokeWidth,
            shapeRendering: 'crispEdges',
            strokeDasharray: this.props.theme.custom.bisRiskChart.grid.strokeDash,
          }}
        />
        <HorizontalGridLines
          tickValues={[0, RiskChartMaxAxisY]}
          style={{ fill: ColorNavLink, strokeWidth: RiskChartGridStrokeWidth, shapeRendering: 'crispEdges' }}
        />
        {this.renderRiskBar()}
        {this.renderRisk()}
        {this.renderCrosshair()}
        {this.renderHint()}
        {this.renderMark(RiskChartMaxAxisY, RiskChartMarkStrokeWidth)}
      </XYPlot>
    )
  }
}

RiskChart.propTypes = {
  riskData: PropTypes.array,
  range: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  chartData: PropTypes.array.isRequired,
  onHighlightChanged: PropTypes.func,
  onRiskEventSelected: PropTypes.func,
  t: PropTypes.func,
}

export default Object.assign(withTranslation()(RiskChart), { displayName: 'LoadNamespace(RiskChart)' })
