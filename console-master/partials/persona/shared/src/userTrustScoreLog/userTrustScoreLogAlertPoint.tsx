import React from 'react'

import type { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'

import { theme } from '@ues/assets'

import { SEVERITY_COLORS_MAP, SEVERITY_NUMBER_TO_NAME_MAP } from './userTrustScoreLog.constants'
import type { PersonaAlertScoreScatterItem } from './userTrustScoreLog.types'

interface StyleProps {
  severity: number
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  alertPoint: ({ severity }) => ({
    backgroundColor: theme.base.props.colors.white,
    strokeWidth: '1px',
    cursor: 'pointer',
    stroke: SEVERITY_COLORS_MAP[SEVERITY_NUMBER_TO_NAME_MAP[severity]],
    '&:hover': {
      fill: SEVERITY_COLORS_MAP[SEVERITY_NUMBER_TO_NAME_MAP[severity]],
    },
  }),
}))

interface UserTrustScoreLogAlertPointPropTypes {
  x?: number
  y?: number
  datum?: PersonaAlertScoreScatterItem
  selectedAlertId: string
  onSelectAlert: (datum: PersonaAlertScoreScatterItem) => void
}

const UserTrustScoreLogAlertPoint = ({ x, y, datum, selectedAlertId, onSelectAlert }: UserTrustScoreLogAlertPointPropTypes) => {
  const { severity } = datum
  const classes = useStyles({ severity })

  const fill = selectedAlertId === datum.id ? SEVERITY_COLORS_MAP[SEVERITY_NUMBER_TO_NAME_MAP[severity]] : 'transparent'

  const onClick = () => onSelectAlert(datum)

  return <circle cx={x} cy={y} r={2} className={classes.alertPoint} fill={fill} onClick={onClick} />
}

export default UserTrustScoreLogAlertPoint
