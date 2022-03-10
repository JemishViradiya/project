/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import debounce from 'lodash/debounce'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import moment from 'moment'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import RootRef from '@material-ui/core/RootRef'
import Typography from '@material-ui/core/Typography'

import type { PersonaScoreLogItem } from '@ues-data/persona'
import { PersonaScoreType } from '@ues-data/persona'
import { theme } from '@ues/assets'

import { PERSONA_EVENT_ID_I18N_MAP, PERSONA_SEVERITY_I18N_MAP } from '../constants'
import {
  PERSONA_SEVERITY_CHIP_CLASSNAME,
  SEVERITY_NUMBER_TO_NAME_MAP,
  USER_TRUST_SCORE_LOG_MODELS,
} from './userTrustScoreLog.constants'
import type { PersonaAlertScoreScatterItem } from './userTrustScoreLog.types'
import UserTrustScoreLogLegendItem from './userTrustScoreLogLegendItem'
// constants
const ALERT_DETAILS_FLYOUT_WIDTH = 450
const ALERT_DETAILS_FLYOUT_WIDTH_HALF = ALERT_DETAILS_FLYOUT_WIDTH / 2
const ALERT_DETAILS_FLYOUT_TOP_MARGIN = 34 // --TODO: get a better measurement of the bottom of the chart to where we want the top of the flyout to be
// helpers
const getScoreMap = (scores: PersonaScoreLogItem[], defaultLabel: string) =>
  reduce(
    USER_TRUST_SCORE_LOG_MODELS,
    (mappedScores, model) => {
      const scoreData = scores.find(s => s.scoreType === model.scoreType)
      const score = get(scoreData, 'score')

      return {
        ...mappedScores,
        [model.scoreType]: typeof score === 'number' ? Math.round(score) : defaultLabel,
      }
    },
    {},
  )

interface UserTrustScoreLogAlertDetailsFlyoutPropTypes {
  chartRef: React.RefObject<HTMLDivElement>
  markerRef: React.RefObject<SVGGElement>
  selectedAlert: PersonaAlertScoreScatterItem
  scores: PersonaScoreLogItem[]
  isScoreForAlertLoading: boolean
}

const UserTrustScoreLogAlertDetailsFlyout = ({
  chartRef,
  markerRef,
  selectedAlert,
  scores,
  isScoreForAlertLoading,
}: UserTrustScoreLogAlertDetailsFlyoutPropTypes) => {
  const { t } = useTranslation(['persona/common'])
  const flyoutRef = useRef(null)

  // state

  const [flyoutPosition, setFlyoutPosition] = useState({
    top: null,
    left: null,
  })

  const [overflow, setOverflow] = useState(null)

  // utils

  /**
   * Calculate the `top` position, `left` position, and possible
   * chart `overflow` of the flyout
   */
  const updateFlyoutPosition = () => {
    if (!markerRef.current || !chartRef.current) {
      // marker/chart isn't rendered yet
      // => nothing to do here
      return
    }

    // get `top` and `left` of the marker
    const { top: markerTop, left: markerLeft } = markerRef.current.getBoundingClientRect()

    // get `top`, `left` and `width` of chart
    const { top: chartTop, left: chartLeft, width: chartWidth } = chartRef.current.getBoundingClientRect()

    // calculate the `top` position of the flyout by:
    //   - subtracting the chart's top from the marker's top
    //   - this will position the flyout directly on top of the marker
    //   - then add `ALERT_DETAILS_FLYOUT_TOP_MARGIN` to push the flyout
    //     below the marker and the x-axis label

    const top = markerTop - chartTop + ALERT_DETAILS_FLYOUT_TOP_MARGIN

    // calculate the `left` position of the flyout by:
    //   - subtracting the chart's left from the marker's left,
    //     then substracting 1/2 of the flyout's width so the middle
    //     of the flyout will line up with the marker
    //   - this will give us the desired `left` position, but we need to
    //     box it within the chart's container by:
    //     - taking 0 if the `left` < 0
    //     - calculating the max left as chart's width MINUS the flyout's width
    //       and taking that if `left` > max

    const minLeft = Math.max(0, markerLeft - chartLeft - ALERT_DETAILS_FLYOUT_WIDTH_HALF)

    const left = Math.min(minLeft, chartWidth - ALERT_DETAILS_FLYOUT_WIDTH)

    setFlyoutPosition({ top, left })
  }

  const updateFlyoutOverflow = () => {
    if (!flyoutRef.current) {
      // flyout not rendered yet
      // => nothing to do here
      return
    }

    // get `height` of chart and flyout
    const { height: chartHeight } = chartRef.current.getBoundingClientRect()
    const { height: flyoutHeight } = flyoutRef.current.getBoundingClientRect()

    // calculate space needed below the chart to account for the flyout's
    // `overflow` by:
    //   - adding the flyout's top position and the flyout's height to get
    //     the position of the flyout's bottom edge
    //   - then subtract the chart's height from this bottom edge to get
    //     the px overflow of the flyout
    //   - use this (or 0) to set the height of the space holder

    const flyoutBottom = flyoutPosition.top + flyoutHeight
    const overflow = Math.max(0, flyoutBottom - chartHeight)

    setOverflow(overflow)
  }

  // effects

  // update the flyout's position whenever the `selectedAlert` changes
  useLayoutEffect(updateFlyoutPosition, [chartRef, markerRef, selectedAlert])

  // update the overflow space holder whenever `flyoutPosition` changes
  useLayoutEffect(updateFlyoutOverflow, [chartRef, flyoutPosition])

  // register resize listener that will update the flyout's
  // position when the window resizes
  useEffect(() => {
    window.addEventListener('resize', debounce(updateFlyoutPosition, 150))

    return () => {
      window.removeEventListener('resize', updateFlyoutPosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // utils

  const getAlertEventName = () => {
    const name = get(PERSONA_EVENT_ID_I18N_MAP, selectedAlert.eventId, 'unknown')
    return t(name)
  }

  const getAlertEventSeverity = () => {
    const severity = get(PERSONA_SEVERITY_I18N_MAP, SEVERITY_NUMBER_TO_NAME_MAP[selectedAlert.severity], 'unknown')
    return t(severity)
  }

  const getAlertEventSeverityClassname = (): any => {
    return get(PERSONA_SEVERITY_CHIP_CLASSNAME, SEVERITY_NUMBER_TO_NAME_MAP[selectedAlert.severity], '')
  }

  // render
  const renderLoader = () => (
    <div>
      <Box
        p={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={theme.light.palette.grey[300]}
        data-autoid="alert-details-flyout-header"
        minHeight={48}
      />
      <Box
        p={6}
        borderRadius={2}
        bgcolor={theme.light.palette.grey[100]}
        width="100%"
        flexDirection="column"
        display="flex"
        alignItems="center"
        justifyContent="start"
        minHeight={194}
      >
        <CircularProgress color="secondary" size={20} />
        <Box pt={4}>
          <Typography variant="body2" color="textSecondary">
            {t('loading')}
          </Typography>
        </Box>
      </Box>
    </div>
  )

  const renderHeader = () => (
    <Box
      p={3}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor={theme.light.palette.grey[300]}
      data-autoid="alert-details-flyout-header"
    >
      <Box display="flex" alignItems="center" pr={1}>
        <Box display="flex" pr={2}>
          <Chip
            label={getAlertEventSeverity()}
            className={getAlertEventSeverityClassname()}
            data-autoid="alert-details-flyout-severity-chip"
          />
        </Box>
        <Typography variant="h3">{getAlertEventName()}</Typography>
      </Box>
      <Box display="flex">
        <Typography variant="caption" color="textSecondary">
          {moment(selectedAlert.x).format('MM/DD/YYYY h:mm A')}
        </Typography>
      </Box>
    </Box>
  )

  const renderBody = () => {
    const scoreMap = getScoreMap(scores || [], t('NA'))

    return (
      <Box p={3} bgcolor={theme.light.palette.grey[100]}>
        <Grid container>
          <Grid item container alignItems="center">
            <Grid item xs={5}>
              <UserTrustScoreLogLegendItem
                {...USER_TRUST_SCORE_LOG_MODELS.TRUSTSCORE}
                enabled={true}
                variant="body2"
                data-autoid={`alert-details-flyout-${USER_TRUST_SCORE_LOG_MODELS.TRUSTSCORE.scoreType}`}
              />
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body2">{scoreMap[PersonaScoreType.TRUSTSCORE]}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box py={2}>
                <Divider />
              </Box>
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={5}>
              <UserTrustScoreLogLegendItem
                {...USER_TRUST_SCORE_LOG_MODELS.META}
                enabled={true}
                variant="body2"
                data-autoid={`alert-details-flyout-${USER_TRUST_SCORE_LOG_MODELS.META.scoreType}`}
              />
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body2">{scoreMap[PersonaScoreType.META]}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box pt={2} pb={1}>
                <Divider />
              </Box>
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={5}>
              <UserTrustScoreLogLegendItem
                {...USER_TRUST_SCORE_LOG_MODELS.KEYBOARD}
                enabled={true}
                variant="body2"
                data-autoid={`alert-details-flyout-${USER_TRUST_SCORE_LOG_MODELS.KEYBOARD.scoreType}`}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{scoreMap[PersonaScoreType.KEYBOARD]}</Typography>
            </Grid>
            <Grid item xs={5}>
              <UserTrustScoreLogLegendItem
                {...USER_TRUST_SCORE_LOG_MODELS.MOUSE}
                enabled={true}
                variant="body2"
                data-autoid={`alert-details-flyout-${USER_TRUST_SCORE_LOG_MODELS.MOUSE.scoreType}`}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{scoreMap[PersonaScoreType.MOUSE]}</Typography>
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={5}>
              <UserTrustScoreLogLegendItem
                {...USER_TRUST_SCORE_LOG_MODELS.LOGON}
                enabled={true}
                variant="body2"
                data-autoid={`alert-details-flyout-${USER_TRUST_SCORE_LOG_MODELS.LOGON.scoreType}`}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{scoreMap[PersonaScoreType.LOGON]}</Typography>
            </Grid>
            <Grid item xs={5}>
              <UserTrustScoreLogLegendItem
                {...USER_TRUST_SCORE_LOG_MODELS.CONDUCT}
                enabled={true}
                variant="body2"
                data-autoid={`alert-details-flyout-${USER_TRUST_SCORE_LOG_MODELS.CONDUCT.scoreType}`}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{scoreMap[PersonaScoreType.CONDUCT]}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    )
  }

  if (flyoutPosition.top === null || flyoutPosition.left == null) {
    return null
  }

  return (
    <>
      <RootRef rootRef={flyoutRef}>
        <Box
          position="absolute"
          width={ALERT_DETAILS_FLYOUT_WIDTH}
          top={flyoutPosition.top}
          left={flyoutPosition.left}
          data-autoid="alert-details-flyout"
        >
          {isScoreForAlertLoading && renderLoader()}
          {isScoreForAlertLoading === false && renderHeader()}
          {isScoreForAlertLoading === false && renderBody()}
        </Box>
      </RootRef>
      <Box height={overflow} />
    </>
  )
}

export default UserTrustScoreLogAlertDetailsFlyout
