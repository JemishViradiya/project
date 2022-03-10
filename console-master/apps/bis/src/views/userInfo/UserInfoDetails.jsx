import moment from 'moment'
import PropTypes from 'prop-types'
import React, { forwardRef, useContext, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { getWidth, useComponentSize } from '@ues-behaviour/react'
import { getDefaultIpAddressLevel } from '@ues-bis/standalone-settings-risk-engines'
import { Icon, RiskIcon } from '@ues-bis/standalone-shared'
import { ArrowCaretDown, ArrowCaretRight, ArrowLeft, BasicLocationUser } from '@ues/assets'

import UserRiskChart from '../../charts/UserRiskChart'
import AppAnomalyRiskScoreInfo from '../../components/AppAnomalyRiskScoreInfo'
import BehavioralPatternRiskInfo from '../../components/BehavioralPatternRiskInfo'
import { default as TenantLink } from '../../components/nav/TenantLink'
import NetworkAnomalyRiskScoreInfo from '../../components/NetworkAnomalyRiskScoreInfo'
import AddressLookupByEventIdProvider from '../../providers/AddressLookupByEventIdProvider'
import AddressLookupProvider from '../../providers/AddressLookupProvider'
import { Context as RiskEnginesSettingsProviderContext } from '../../providers/RiskEngineSettingsProvider'
import {
  Action,
  ActionBar,
  Avatar,
  common,
  GeozoneIcon,
  HelpTip,
  IconButton,
  RiskLevel,
  useClientParams,
  useToggle,
} from '../../shared'
import styles from './UserInfoDetails.module.less'

const riskColorStyle = {
  [RiskLevel.CRITICAL]: styles.critical,
  [RiskLevel.HIGH]: styles.high,
  [RiskLevel.MEDIUM]: styles.medium,
  [RiskLevel.LOW]: styles.low,
  [RiskLevel.UNKNOWN]: styles.unknown,
}

const riskBorderColorStyle = {
  [RiskLevel.CRITICAL]: styles.border_critical,
  [RiskLevel.HIGH]: styles.border_high,
  [RiskLevel.MEDIUM]: styles.border_medium,
  [RiskLevel.LOW]: styles.border_low,
  [RiskLevel.UNKNOWN]: styles.border_unknown,
}

const getChartWidth = el => {
  const infoBoxWidth = getWidth(el)
  return Math.max(200, infoBoxWidth - 100)
}

const UserInfoDetails = forwardRef(
  (
    { highlightEvent, onHighlightChanged, onRiskEventSelected, range, riskEvents, selectedEvent, userId, userInfo, list: List },
    ref,
  ) => {
    const { t } = useTranslation()
    const {
      features: { RiskScoreResponseFormat, IpAddressRisk = false, NetworkAnomalyDetection = false },
    } = useClientParams()
    const { data: riskEnginesSettings } = useContext(RiskEnginesSettingsProviderContext)
    const [showDetails, toggleShowDetails] = useToggle(false)
    const infoBoxRef = useRef(null)
    const windowWidthTrigger = useComponentSize(infoBoxRef, getChartWidth) || 0

    const userProfile = useMemo(() => {
      let title
      if (userInfo.title && userInfo.department) {
        title = `${userInfo.title}, ${userInfo.department}`
      } else if (userInfo.title) {
        title = userInfo.title
      } else {
        title = userInfo.department || ''
      }
      const iconName = showDetails ? ArrowCaretDown : ArrowCaretRight
      let displayName = userInfo.displayName
      if (!displayName) {
        displayName = t('common.unknown')
      }
      const extra = showDetails ? (
        <div>
          {userInfo.username ? <div className={styles.userInfo}>{`${t('user.username')}: ${userInfo.username}`}</div> : null}
          <div className={styles.userInfo}>{`${t('user.userId')}: ${userId}`}</div>
          {userInfo.department ? <div className={styles.userInfo}>{`${t('user.department')}: ${userInfo.department}`}</div> : null}
        </div>
      ) : null
      return (
        <div className={styles.user}>
          <Avatar userInfo={userInfo} />
          <div className={styles.userData}>
            <div className={styles.userName} role="button" tabIndex="-1" onClick={toggleShowDetails}>
              <span>{displayName}</span>
              {userInfo.username ? (
                <Icon
                  className={styles.userIcon}
                  icon={iconName}
                  title={showDetails ? t('user.showLessInfo') : t('user.showMoreInfo')}
                />
              ) : null}
            </div>
            <div className={styles.userInfo}>{title}</div>
            <div className={styles.userInfo}>{userInfo.primaryEmail}</div>
            {extra}
          </div>
        </div>
      )
    }, [userInfo, userId, showDetails, toggleShowDetails, t])

    const navBar = useMemo(
      () => (
        <div className={styles.navBar}>
          <div data-testid="navBar" className={styles.leftBox}>
            <TenantLink to="/users" goBack>
              <IconButton title={t('common.back')}>
                <Icon icon={ArrowLeft} />
              </IconButton>
            </TenantLink>
            {userProfile}
          </div>
          <ActionBar />
        </div>
      ),
      [t, userProfile],
    )

    const riskLevel = useMemo(() => (selectedEvent ? selectedEvent.assessment.behavioralRiskLevel : RiskLevel.LOW), [selectedEvent])
    const displayRiskLevel = `${riskLevel.toLowerCase()}`
    const riskChart = useMemo(
      () => (
        <div data-testid="UserRiskChart" className={styles.chart}>
          <UserRiskChart
            eEcoId={userId}
            width={Math.ceil(windowWidthTrigger)}
            height={150}
            riskEvents={riskEvents}
            riskEvent={selectedEvent}
            highlightEvent={highlightEvent}
            range={range}
            onHighlightChanged={onHighlightChanged}
            onRiskEventSelected={onRiskEventSelected}
          />
        </div>
      ),
      [userId, windowWidthTrigger, riskEvents, selectedEvent, highlightEvent, range, onHighlightChanged, onRiskEventSelected],
    )

    const detailsTitle = useMemo(() => {
      if (!selectedEvent || !selectedEvent.assessment) {
        return null
      }

      const eventTime = moment(selectedEvent.assessment.datetime)
      let timeLabel
      if (moment(0, 'H').diff(eventTime) <= 0) {
        timeLabel = `${t('common.today')} ${eventTime.format('h:mm a')}`
      } else {
        timeLabel = eventTime.format('MMM Do, h:mm a')
      }

      if (selectedEvent.assessment.datapoint && selectedEvent.assessment.datapoint.source) {
        const source = selectedEvent.assessment.datapoint.source
        if (source.appName && source.deviceModel) {
          return `${timeLabel} - ${t('user.accessedAppUsingDeviceModel', {
            app: source.appName,
            deviceModel: source.deviceModel,
          })}`
        } else if (source.appName) {
          return `${timeLabel} - ${t('user.accessedApp', {
            app: source.appName,
          })}`
        } else if (source.deviceModel) {
          return `${timeLabel} - ${t('user.usingDeviceModel', {
            deviceModel: source.deviceModel,
          })}`
        }
      }
      return timeLabel
    }, [selectedEvent, t])

    const ipRiskScoreInfo = useMemo(() => {
      if (!IpAddressRisk) {
        return null
      }
      const ipAddressType = IpAddressRisk ? common.getIpAddressRisk(selectedEvent?.assessment?.mappings?.ipAddress, t) : undefined
      const ipAddressInfo = `${t('common.ipAddress')}: ${ipAddressType}`
      const ipAddressRiskLevel = getDefaultIpAddressLevel(
        riskEnginesSettings,
        common.ipAddressSourceMap[selectedEvent?.assessment?.mappings?.ipAddress?.mappings?.source],
      )
      return (
        ipAddressType !== undefined && (
          <div className={styles.infoEntry}>
            <RiskIcon level={ipAddressRiskLevel} size="title" />
            <span className={styles.entryText}>{ipAddressInfo}</span>
          </div>
        )
      )
    }, [IpAddressRisk, riskEnginesSettings, selectedEvent?.assessment?.mappings?.ipAddress, t])

    const details = useMemo(() => {
      if (!selectedEvent) {
        return null // can happen if date range has no events at all
      }
      try {
        const {
          assessment: { mappings, geozoneRiskLevel },
        } = selectedEvent
        const { behavioral, definedgeozone, appAnomalyDetection, networkAnomalyDetection } = mappings || {}
        const { score: behavioralPatternScore, riskLevel: behavioralPatternRiskLevel } = behavioral || {}
        const { riskScore: appAnomalyRiskScore } = appAnomalyDetection || {}
        const { riskScore: networkAnomalyRiskScore } = networkAnomalyDetection || {}
        const geozoneName = (definedgeozone && definedgeozone.meta && definedgeozone.meta.geozoneName) || ''
        const geozoneRiskLevelT = t(`risk.level.${geozoneRiskLevel}`)
        const zoneInfo = geozoneName
          ? `${t('common.geozoneRisk')}: ${geozoneName} (${geozoneRiskLevelT})`
          : `${t('common.geozoneRisk')}: ${geozoneRiskLevelT}`

        return (
          <div className={styles.riskDetails}>
            <div className={styles.infoTitle}>{detailsTitle}</div>
            <div data-testid="UserInfoRiskInfo" className={styles.infoEntry}>
              <RiskIcon
                level={RiskLevel.behavioralEngineBasedRiskLevel(
                  behavioralPatternScore,
                  behavioralPatternRiskLevel,
                  riskEnginesSettings?.behavioral?.riskLevels,
                )}
                size="title"
              />
              <span className={styles.entryText}>
                <BehavioralPatternRiskInfo showWithScore score={behavioralPatternScore} level={behavioralPatternRiskLevel} />
              </span>
            </div>
            {RiskScoreResponseFormat && RiskLevel.isValidRiskScore(appAnomalyRiskScore) && (
              <div data-testid="UserInfoAppAnomaly" className={styles.infoEntry}>
                <RiskIcon
                  level={RiskLevel.appAnomalyDetectionBasedRiskLevel(
                    RiskLevel.appAnomalyRiskLevel(appAnomalyRiskScore, riskEnginesSettings?.appAnomalyDetection?.range),
                    riskEnginesSettings?.appAnomalyDetection?.riskLevel,
                  )}
                  size="title"
                />
                <span className={styles.entryText}>
                  <AppAnomalyRiskScoreInfo riskScore={appAnomalyRiskScore} />
                </span>
              </div>
            )}

            {NetworkAnomalyDetection && RiskScoreResponseFormat && RiskLevel.isValidRiskScore(networkAnomalyRiskScore) && (
              <div data-testid="UserInfoNetworkAnomaly" className={styles.infoEntry}>
                <RiskIcon
                  level={RiskLevel.networkAnomalyDetectionBasedRiskLevel(
                    RiskLevel.networkAnomalyRiskLevel(networkAnomalyRiskScore, riskEnginesSettings?.networkAnomalyDetection?.range),
                    riskEnginesSettings?.networkAnomalyDetection?.riskLevel,
                  )}
                  size="title"
                />
                <span className={styles.entryText}>
                  <NetworkAnomalyRiskScoreInfo riskScore={networkAnomalyRiskScore} />
                </span>
              </div>
            )}

            {ipRiskScoreInfo}

            <div className={styles.infoEntry}>
              <GeozoneIcon level={geozoneRiskLevel} size="title" />
              <span className={styles.entryText}>{zoneInfo}</span>
            </div>
          </div>
        )
      } catch (err) {
        // In case of errors in our datapoint. DB normalization should have taken care of it, but we don't
        // want the page to break if it happens.
        console.log('Unable to render details:', err)
        return null
      }
    }, [
      selectedEvent,
      t,
      detailsTitle,
      riskEnginesSettings?.behavioral?.riskLevels,
      riskEnginesSettings?.appAnomalyDetection?.range,
      riskEnginesSettings?.appAnomalyDetection?.riskLevel,
      riskEnginesSettings?.networkAnomalyDetection?.range,
      riskEnginesSettings?.networkAnomalyDetection?.riskLevel,
      RiskScoreResponseFormat,
      ipRiskScoreInfo,
      NetworkAnomalyDetection,
    ])

    const actions = useMemo(() => {
      const operatingMode = (selectedEvent && selectedEvent.operatingMode) || ''
      const sisActions = selectedEvent && selectedEvent.sisActions
      return (
        <div className={styles.riskDetails}>
          <div className={styles.infoTitle}>{t('usersEvents.assignedAction')}</div>
          <Action operatingMode={operatingMode} sisActions={sisActions} oneColumn />
        </div>
      )
    }, [selectedEvent, t])

    const policies = useMemo(() => {
      const sisActions = selectedEvent && selectedEvent.sisActions
      if (sisActions && sisActions.policyName) {
        return (
          <div className={styles.riskDetails}>
            <div className={styles.infoTitle}>{t('user.assignedPolicy')}</div>
            <div className={styles.eventPolicy}>{sisActions.policyName}</div>
            {/* Edit button to open modal as per UX mock up */}
            {/* <div role="button" onClick={} className={styles.eventPolicyEdit} tabIndex={0}>
              {t('common.edit')}
            </div> */}
          </div>
        )
      } else {
        return null
      }
    }, [selectedEvent, t])

    const summary = useMemo(() => {
      let addressLookup = t('common.unknown')
      if (selectedEvent && selectedEvent.assessment) {
        const { assessment: { location } = {}, id } = selectedEvent
        addressLookup = location ? (
          <AddressLookupProvider defaultValue={addressLookup} location={location} />
        ) : (
          <AddressLookupByEventIdProvider defaultValue={addressLookup} eventId={id} />
        )
      }
      return (
        <div className={styles.riskSummary}>
          <div className={styles.riskInfoBlock}>
            <div className={styles.infoTitle}>
              <HelpTip
                wrappedText={t('user.identityRiskLevel')}
                helpText={t('common.assessmentOfRiskBasedOnUserTypicalActivities')}
              />
            </div>
            <div className={`${styles.riskInfoDesc} ${riskColorStyle[riskLevel]}`} title={`risk.identity.${displayRiskLevel}`}>
              <Icon className={`${styles.riskInfoIcon} ${riskColorStyle[riskLevel]}`} icon={BasicLocationUser} />
              {t(`risk.level.${riskLevel}`)}
            </div>
          </div>
          <div className={styles.riskInfoBlock}>
            <div className={styles.infoTitle}>{t('common.location')}</div>
            <div className={styles.riskInfoDesc}>{addressLookup}</div>
          </div>
        </div>
      )
    }, [t, selectedEvent, riskLevel, displayRiskLevel])

    const riskInfo = useMemo(() => {
      if (!selectedEvent) {
        return <div className={styles.infoTitle}>{t('usersEvents.noRiskEvent')}</div>
      }
      return (
        <div className={styles.riskInfo}>
          {summary}
          {details}
          {policies}
          {actions}
        </div>
      )
    }, [selectedEvent, summary, details, actions, policies, t])

    const chartInfo = useMemo(() => {
      return (
        <div className={`${styles.chartInfo} ${riskBorderColorStyle[riskLevel]}`}>
          {riskChart}
          {riskInfo}
        </div>
      )
    }, [riskChart, riskInfo, riskLevel])

    return (
      <div data-testid="UserInfoDetails" className={styles.info} ref={infoBoxRef}>
        {navBar}
        {chartInfo}
        <div className={styles.list}>{List}</div>
      </div>
    )
  },
)

UserInfoDetails.propTypes = {
  onHighlightChanged: PropTypes.func.isRequired,
  onRiskEventSelected: PropTypes.func.isRequired,
  riskEvents: PropTypes.array,
  range: PropTypes.object.isRequired,
  highlightEvent: PropTypes.object,
  selectedEvent: PropTypes.object,
  userId: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,
}
UserInfoDetails.displayName = 'UserInfoDetails'

export default UserInfoDetails
