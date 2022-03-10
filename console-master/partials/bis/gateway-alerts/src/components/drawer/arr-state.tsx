import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Collapse from '@material-ui/core/Collapse'
import { makeStyles } from '@material-ui/core/styles'

import { GatewayAlertsFixupDetailsQuery } from '@ues-data/bis'
import { ChallengeState } from '@ues-data/bis/model'
import { useStatefulApolloQuery } from '@ues-data/shared'
import type { UesTheme } from '@ues/assets'
import { ChevronDown, I18nFormats, StatusMedium } from '@ues/assets'

import { EXPECTED_CHALLENGE_STATES_SET, TRANSLATION_NAMESPACES } from '../../config'

export const useStyles = makeStyles<UesTheme>(theme => ({
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    '& > span': {
      alignItems: 'center',
      display: 'flex',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '& > svg': {
        width: '1rem',
        height: '1rem',
        marginRight: theme.spacing(2),
      },
    },
  },
  chevron: ({ collapsed }: { collapsed: boolean }) => ({
    width: '1.5rem',
    height: '1.5rem',
    transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
    transition: theme.transitions.create('transform', { easing: theme.transitions.easing.sharp }),
    marginLeft: theme.spacing(2),
  }),
  detailsContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  detailsEntry: {
    display: 'flex',
    color: theme.palette.text.secondary,
    ...theme.typography.caption,
    '& > time': {
      marginRight: theme.spacing(3),
    },
  },
}))

export const ArrState = memo<{ datapointId?: string; state?: ChallengeState }>(({ datapointId, state }) => {
  const { t, i18n } = useTranslation(TRANSLATION_NAMESPACES)
  const [collapsed, setCollapsed] = useState(true)
  const classNames = useStyles({ collapsed })

  const { data } = useStatefulApolloQuery(GatewayAlertsFixupDetailsQuery, {
    variables: { datapointId },
    skip: !datapointId,
  })

  const entries = useMemo(() => (data?.fixupDetails ?? []).filter(entry => EXPECTED_CHALLENGE_STATES_SET.has(entry.state)), [
    data?.fixupDetails,
  ])

  const toggleCollapsed = useCallback(() => setCollapsed(current => !current), [setCollapsed])

  return (
    <div>
      <div className={classNames.header} onClick={toggleCollapsed} onKeyDown={toggleCollapsed} role="button" tabIndex={-1}>
        <span>
          {state === ChallengeState.NoMfa ? <StatusMedium /> : null}
          {t(`bis/shared:arr.challengeState.${state}`)}
        </span>
        {entries.length > 0 ? <ChevronDown className={classNames.chevron} /> : null}
      </div>
      {entries.length > 0 ? (
        <Collapse className={classNames.detailsContainer} in={!collapsed}>
          {entries.map(entry => (
            <div className={classNames.detailsEntry}>
              <time>{i18n.format(entry.datetime, I18nFormats.DateTime)}</time>
              <span>{t(`bis/shared:arr.challengeState.${entry.state}`)}</span>
            </div>
          ))}
        </Collapse>
      ) : null}
    </div>
  )
})
