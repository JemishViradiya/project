import type { TFunction } from 'i18next'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'

import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { ActionType, ChallengeState, OperatingMode } from '@ues-data/bis/model'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { StatusMedium } from '@ues/assets'

import { EXPECTED_CHALLENGE_STATES_SET, TRANSLATION_NAMESPACES } from '../../config'

export interface ResponseCellProps {
  row: GatewayAlertsQueryEvent
}

const ACTIONS_LABELS_RESOLVERS: Record<string, (action: any, t: TFunction) => string> = {
  [ActionType.OverrideNetworkAccessControlPolicy]: (action, t) =>
    t('bis/ues:gatewayAlerts.columns.response.overrideNetworkAccessPolicy', { name: action.name }),
}

interface StylesProps {
  isPassiveMode?: boolean
}

const useStyles = makeStyles(theme => ({
  container: {
    height: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  responsesWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  responsePart: ({ isPassiveMode }: StylesProps = {}) => ({
    alignItems: 'center',
    fontStyle: isPassiveMode ? 'italic' : undefined,
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

const ActionsPart = memo<{ row: GatewayAlertsQueryEvent }>(({ row }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const isPassiveMode = row.operatingMode === OperatingMode.PASSIVE
  const classNames = useStyles({ isPassiveMode })

  let text = (row.sisActions?.actions ?? [])
    .map(action => {
      const labelResolver = ACTIONS_LABELS_RESOLVERS[action.type]

      return labelResolver ? labelResolver(action, t) : undefined
    })
    .filter(label => label !== undefined)
    .join(', ')

  if (text && isPassiveMode) {
    text = t('bis/ues:gatewayAlerts.columns.response.passiveModePrefix', { text })
  }

  return (
    <div className={classNames.responsePart} title={text}>
      <div className={classNames.ellipsis}>{text}</div>
    </div>
  )
})

const ChallengeStatePart = memo<{ row: GatewayAlertsQueryEvent }>(({ row }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const classNames = useStyles({})

  if (!row.fixup || !EXPECTED_CHALLENGE_STATES_SET.has(row.fixup) || row.fixup === ChallengeState.NotApplicable) {
    return null
  }

  const text = t(`bis/ues:gatewayAlerts.columns.response.challengeState.${row.fixup}`)

  return (
    <div className={classNames.responsePart} title={text}>
      {row.fixup === ChallengeState.NoMfa ? <StatusMedium /> : null}
      <div className={classNames.ellipsis}>{text}</div>
    </div>
  )
})

export const ResponseCell: React.FC<ResponseCellProps> = ({ row }) => {
  const classNames = useStyles({})
  const features = useFeatures()
  const arrEnabled = features.isEnabled(FeatureName.ARR)

  return (
    <div className={classNames.container}>
      <div className={classNames.responsesWrapper}>
        <ActionsPart row={row} />
        {arrEnabled && <ChallengeStatePart row={row} />}
      </div>
    </div>
  )
}
