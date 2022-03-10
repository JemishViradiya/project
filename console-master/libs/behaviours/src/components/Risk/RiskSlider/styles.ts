//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { makeStyles } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'

import { RISK_LEVEL_NUMBER } from '../constants'

const useStyles = makeStyles<UesTheme, { riskSliderValue: number[]; withSecured: boolean; disabled: boolean }>(theme => {
  const riskThumbColor = {
    [RISK_LEVEL_NUMBER.SECURED]: theme.palette.chipAlert.secure,
    [RISK_LEVEL_NUMBER.LOW]: theme.palette.chipAlert.low,
    [RISK_LEVEL_NUMBER.MEDIUM]: theme.palette.chipAlert.medium,
    [RISK_LEVEL_NUMBER.HIGH]: theme.palette.chipAlert.high,
  }

  const makeBackgroundColor = (withSecured: boolean) =>
    withSecured
      ? [theme.palette.chipAlert.secure, theme.palette.chipAlert.low, theme.palette.chipAlert.medium, theme.palette.chipAlert.high]
      : [theme.palette.chipAlert.low, theme.palette.chipAlert.medium, theme.palette.chipAlert.high]

  const makeOpacity = (predicate: boolean) => (predicate ? '100%' : '50%')

  return {
    wrapper: {
      width: '100%',
    },
    rail: {
      opacity: 0,
    },
    thumb: {
      '&[data-index="0"]': {
        backgroundColor: ({ riskSliderValue }) => riskThumbColor[riskSliderValue[0]],
      },
      '&[data-index="1"]': {
        backgroundColor: ({ riskSliderValue }) => riskThumbColor[riskSliderValue[1] - 1],
      },
    },
    mark: {
      '&[data-index="0"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[0],
      },

      '&[data-index="1"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[1],
      },

      '&[data-index="2"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[2],
      },

      '&[data-index="3"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[3],
      },
    },
    markLabel: {
      width: ({ withSecured }) => (withSecured ? 'calc(100% / 4)' : 'calc(100% / 3)'),
      height: 2,
      top: 'calc(50% - 1px)',
      transform: 'initial',

      '&[data-index="0"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[RISK_LEVEL_NUMBER.SECURED],
        opacity: ({ riskSliderValue, withSecured }) => {
          const min = withSecured ? RISK_LEVEL_NUMBER.SECURED : RISK_LEVEL_NUMBER.LOW

          return makeOpacity(riskSliderValue[0] === min)
        },
      },

      '&[data-index="1"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[RISK_LEVEL_NUMBER.LOW],
        opacity: ({ riskSliderValue, withSecured }) => {
          const min = withSecured ? RISK_LEVEL_NUMBER.LOW : RISK_LEVEL_NUMBER.MEDIUM
          const max = withSecured ? RISK_LEVEL_NUMBER.MEDIUM : RISK_LEVEL_NUMBER.HIGH
          const isActive = riskSliderValue[0] < max && riskSliderValue[1] > min

          return makeOpacity(isActive)
        },
      },

      '&[data-index="2"]': {
        backgroundColor: ({ withSecured }) => makeBackgroundColor(withSecured)[RISK_LEVEL_NUMBER.MEDIUM],
        opacity: ({ riskSliderValue, withSecured }) => {
          const isActive = withSecured
            ? riskSliderValue[0] < RISK_LEVEL_NUMBER.HIGH && riskSliderValue[1] > RISK_LEVEL_NUMBER.MEDIUM
            : riskSliderValue[1] > RISK_LEVEL_NUMBER.HIGH

          return makeOpacity(isActive)
        },
      },

      '&[data-index="3"]': {
        backgroundColor: theme.palette.chipAlert.high,
        opacity: ({ riskSliderValue }) => makeOpacity(riskSliderValue[1] === RISK_LEVEL_NUMBER.HIGH + 1),
      },
    },
    title: {
      marginBottom: theme.spacing(6),
    },
    riskSliderHelperText: {
      marginRight: theme.spacing(3.5),
      marginLeft: theme.spacing(3.5),
      marginTop: theme.spacing(1),
      color: ({ disabled }) => (disabled ? theme.palette.text.disabled : theme.palette.text.primary),
    },
  }
})

export default useStyles
