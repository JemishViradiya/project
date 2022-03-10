/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import moment from 'moment'

import { PersonaScoreChartInterval } from '@ues-data/persona'
import { theme } from '@ues/assets'

import {
  CHART_LABEL_SLANT,
  CHART_LINE_TYPE,
  CHART_TRANSPARENCY,
  MAX_TRUST_SCORE,
  MIN_TRUST_SCORE,
  USER_TRUST_SCORE_LOG_MODELS,
} from './userTrustScoreLog.constants'

export const getChartStyles = () => {
  const axisBase = {
    axisLabel: {
      fontSize: 8,
      padding: 30,
      fill: theme.light.palette.grey[600],
    },
    tickLabels: {
      fontSize: 5,
      fontFamily: "'roboto_regular', Arial, sans-serif",
      fill: theme.light.palette.grey[600],
    },
  }

  return {
    parent: {
      maxWidth: '100%',
    },
    axisTime: {
      ...axisBase,
      tickLabels: {
        ...axisBase.tickLabels,
        angle: CHART_LABEL_SLANT.X_NEGATIVE_45,
      },
    },
    axisScore: {
      ...axisBase,
      axis: { stroke: 'none' },
      grid: {
        stroke: theme.light.palette.grey[300],
      },
    },
  }
}

export const getModelStyle = key => {
  const lineType = USER_TRUST_SCORE_LOG_MODELS[key].dashLineIcon ? CHART_LINE_TYPE.DASHED_LINE_22 : ''
  const lineOpacity = USER_TRUST_SCORE_LOG_MODELS[key].dashLineIcon
    ? CHART_TRANSPARENCY.DASHED_LINE
    : CHART_TRANSPARENCY.NO_TRANSPARENCY

  return {
    data: {
      opacity: lineOpacity,
      strokeWidth: USER_TRUST_SCORE_LOG_MODELS[key].width,
      stroke: USER_TRUST_SCORE_LOG_MODELS[key].color,
      strokeDasharray: lineType,
    },
  }
}

// Define tick values and format
export const getFromTime = (interval, toTime) => {
  const fromTime = interval => {
    if (interval === PersonaScoreChartInterval.Last30Days) {
      return moment(toTime).add(-30, 'day').toDate()
    } else {
      return moment(toTime).add(-1, 'day').toDate()
    }
  }

  return fromTime(interval)
}

export const getTimeTickValues = (toTime, interval) => {
  const values = []
  if (interval === PersonaScoreChartInterval.Last30Days) {
    for (let i = 0; i < 16; i++) {
      const tick = new Date(toTime)
      tick.setDate(tick.getDate() - 2 * i)
      values.unshift(tick)
    }
  } else {
    for (let i = 0; i < 13; i++) {
      const tick = new Date(toTime)
      tick.setHours(tick.getHours() - 2 * i)
      tick.setMinutes(0)
      values.unshift(tick)
    }
  }

  return values
}

export const getTimeTickFormat = (interval, tick) => {
  return interval === PersonaScoreChartInterval.Last24Hours ? moment(tick).format('hA') : moment(tick).format('MMM D')
}

export const getScoreTickValues = () => {
  const values = []
  for (let i = MIN_TRUST_SCORE; i <= MAX_TRUST_SCORE; i = i + 10) {
    values.push(i)
  }
  return values
}

export const getScoreTickFormat = tick => {
  if (tick % 20) {
    return ''
  }
  return tick
}

export const prepareDatum = scores =>
  scores.map(item => ({
    x: new Date(item.timestamp),
    y: item.score,
  }))
