import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicClose, BasicSearch, BasicUserProfile, StatusUnknown } from '@ues/assets'

import { getLogoutUrl } from '../../auth/token'
import { useIdentity } from '../../providers/IdentityProvider'
import useOperatingMode from '../../providers/OperatingModeProvider'
import useClientParams from '../hooks/useClientParams'
import useGlobalActionListener from '../hooks/useGlobalActionListener'
import { Icon } from '../icons/Icon'
import Button from './Button'
import IconButton from './IconButton'
import styles from './TopNavBar.module.less'

const SUPPORT_CENTER_URL = 'https://docs.blackberry.com/en/unified-endpoint-security/blackberry-persona-uem/latest'

const ModeSearch = 'search'
const ModeUserInfo = 'userInfo'
const ModeSet = [ModeSearch, ModeUserInfo]

const stopEventPropagation = ev => {
  ev.stopPropagation()
  // Have to call stopImmediatePropagation on nativeEvent of SyntheticEvent. Refer to:
  // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
  ev.nativeEvent.stopImmediatePropagation()
}

const UserInfo = memo(({ identity: { displayName, roleTitle, primaryEmail: email } = {} }) => (
  <div className={styles.userInfo} role="button" tabIndex="-1" onClick={stopEventPropagation}>
    {displayName && <div className={styles.bold}>{displayName}</div>}
    {roleTitle && <div className={styles.normal}>{roleTitle}</div>}
    {email && <div className={styles.normal}>{email}</div>}
  </div>
))

const TopNavBar = memo(() => {
  const { t } = useTranslation()
  const [activeMode, setActiveMode] = useState(null)
  const accountRef = useRef(null)

  const handleClickOutside = useCallback(
    event => {
      if ((!accountRef.current || !accountRef.current.contains(event.target)) && activeMode !== null) {
        setActiveMode(null)
      }
    },
    [accountRef, activeMode, setActiveMode],
  )

  useGlobalActionListener(activeMode !== null, handleClickOutside, [
    ['click', { capture: true }],
    ['touchend', { capture: true }],
  ])

  const onModeChange = useMemo(() => {
    const result = {}
    ModeSet.forEach(
      mode =>
        (result[mode] = ev => {
          stopEventPropagation(ev)
          setActiveMode(activeMode === mode ? null : mode)
        }),
    )
    return result
  }, [activeMode, setActiveMode])

  const onSearchChange = useCallback(event => {
    // FIXME: add implementation in future.
    console.log(event.target.value)
  }, [])

  const parameters = useClientParams('support')
  const onHelpClick = useCallback(() => {
    const helpUrl = (parameters && parameters.helpUrl) || SUPPORT_CENTER_URL
    window.open(helpUrl, '')
  }, [parameters])

  const onLogoutClick = useCallback(() => {
    const url = getLogoutUrl()
    if (url) {
      window.location.assign(url)
    }
  }, [])

  const identity = useIdentity()
  const userInfo = useMemo(() => {
    if (activeMode === ModeUserInfo && identity) {
      return <UserInfo identity={identity} />
    }
    return null
  }, [identity, activeMode])

  const { operatingMode } = useOperatingMode()

  return (
    <div className={styles.bar}>
      {operatingMode ? (
        <div className={styles.operatingMode}>
          {t('dashboard.operatingMode', { operatingMode: t(`common.operatingMode.${operatingMode}`) })}
        </div>
      ) : null}
      {activeMode === ModeSearch ? (
        <div className={styles.searchWrapper}>
          <div className={`${styles.icon} ${styles.active}`} title={t('common.search')}>
            <Icon icon={BasicSearch} />
          </div>
          <input className={styles.search} placeholder={t('dashboard.searchApp')} onChange={onSearchChange} />
          <div className={`${styles.icon} ${styles.small}`}>
            <Icon icon={BasicClose} onClick={onModeChange[ModeSearch]} />
          </div>
          <div className={styles.separator} />
        </div>
      ) : (
        <div className={styles.searchWrapper}>
          <div className={styles.icon} title={t('common.search')}>
            <Icon icon={BasicSearch} onClick={onModeChange[ModeSearch]} />
          </div>
        </div>
      )}
      <div className={styles.userButtonWrapper} ref={accountRef}>
        <IconButton
          size="small"
          color={activeMode === ModeUserInfo ? 'primary' : 'inherit'}
          title={t('dashboard.myAccount')}
          onClick={onModeChange[ModeUserInfo]}
        >
          <Icon icon={BasicUserProfile} />
        </IconButton>
        {userInfo}
      </div>
      <IconButton size="small" title={t('common.help')} onClick={onHelpClick}>
        <Icon icon={StatusUnknown} />
      </IconButton>
      <div className={styles.separator} />
      <div className={styles.rightBox}>
        <Button variant="text" size="small" onClick={onLogoutClick}>
          {t('dashboard.signOut')}
        </Button>
      </div>
    </div>
  )
})
TopNavBar.displayName = 'TopNavBar'

export default TopNavBar
