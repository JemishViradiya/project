import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'

import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { ChallengeState } from '@ues-data/bis/model'
import { StatusMedium } from '@ues/assets'

import { EXPECTED_CHALLENGE_STATES_SET, TRANSLATION_NAMESPACES } from '../../config'

export interface IdentityChallengeCellProps {
  row: GatewayAlertsQueryEvent
}

const useStyles = makeStyles(theme => ({
  responsePart: () => ({
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    '& > svg': {
      marginRight: theme.spacing(2),
      maxHeight: '1rem',
    },
  }),
  ellipsis: {
    flex: 1,
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}))

export const IdentityChallengeCell: React.FC<IdentityChallengeCellProps> = ({ row }) => {
  const classNames = useStyles({})

  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  if (!row.fixup || !EXPECTED_CHALLENGE_STATES_SET.has(row.fixup) || row.fixup === ChallengeState.NotApplicable) {
    return null
  }

  const text = t(`bis/ues:gatewayAlerts.columns.identityChallenge.challengeState.${row.fixup}`)

  return (
    <div className={classNames.responsePart} title={text}>
      {row.fixup === ChallengeState.NoMfa ? <StatusMedium /> : null}
      <div className={classNames.ellipsis}>{text}</div>
    </div>
  )
}
