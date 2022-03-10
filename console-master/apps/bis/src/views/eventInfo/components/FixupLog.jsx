import moment from 'moment'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ArrowCaretDown, ArrowCaretRight } from '@ues/assets'

import { Icon, useToggle } from '../../../shared'
import styles from './FixupLog.module.less'

const FixupLog = memo(({ data, onRefresh }) => {
  const { t } = useTranslation()
  const [showDetails, toggleShowDetails] = useToggle(true)

  if (!data || data.length === 0) {
    return null
  }
  const convertReachToFixupState = challengeResponseResult => (challengeResponseResult ? 'valid' : 'invalid')
  const iconName = showDetails ? ArrowCaretDown : ArrowCaretRight

  // If we have no entries with a challenge state, don't show anything for the state
  // This could happen if we received two assessments for the same datapoint, but no
  // fixup messages.
  let lastState
  // Data is sorted ascending so last entry with a state is current status
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].issuedIdentityChallenge && data[i].issuedIdentityChallenge.state) {
      lastState = data[i].issuedIdentityChallenge.state
      break
    } else if (data[i].reAuthenticateToConfirm) {
      lastState = convertReachToFixupState(data[i].reAuthenticateToConfirm.challengeResponseResult)
      break
    }
  }
  const logs = showDetails
    ? data.map((log, i) => {
        let message
        // TODO: handle REACH
        if (log.issuedIdentityChallenge) {
          message = t(`risk.challengeState.message.${log.issuedIdentityChallenge.state}`)
        } else if (log.reAuthenticateToConfirm) {
          const { challengeResponseResult } = log.reAuthenticateToConfirm
          message = t(`risk.challengeState.message.${convertReachToFixupState(challengeResponseResult)}`)
        } else if (log.behavioralRiskLevel) {
          message = t('risk.common.identityLevelChanged', { level: t(`risk.level.${log.behavioralRiskLevel}`) })
        }
        return (
          <div className={styles.fixupLog} key={`FixupLog-${i}`}>
            <div className={styles.fixupDate}>{moment(log.datetime).format('l LT')}</div>
            <div>{message}</div>
          </div>
        )
      })
    : null
  const refresh =
    lastState === 'in_progress' ? (
      <div className={styles.fixupLog} key="FixupLog-refresh">
        <span role="button" tabIndex="-1" onClick={onRefresh} className={styles.refresh}>
          {t('common.refresh')}
        </span>
      </div>
    ) : null
  return (
    <div>
      <div className={styles.fixupHeader} role="button" tabIndex="-1" onClick={toggleShowDetails}>
        <span>{lastState ? t(`risk.challengeState.type.${lastState}`) : null}</span>
        <Icon className={styles.expandIcon} icon={iconName} />
      </div>
      {logs}
      {refresh}
    </div>
  )
})

FixupLog.propTypes = {
  data: PropTypes.array,
  onRefresh: PropTypes.func.isRequired,
}
FixupLog.displayName = 'FixupLog'

export default FixupLog
