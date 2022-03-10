import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ArrowLeft } from '@ues/assets'

import { default as TenantLink } from '../../components/nav/TenantLink'
import { Icon, IconButton, MapViewModeSwitch, RiskLevelBlob } from '../../shared'
import AssignedActionTable from './components/AssignedActionTable'
import RiskStatusTable from './components/RiskStatusTable'
import UserInfoTable from './components/UserInfoTable'
import styles from './EventInfoDetails.module.less'

export const EventInfoDetails = memo(
  ({ eventId, eEcoId, riskLevel, userInfo, showMap, onHideMap, onShowMap, updated, fixup, ...props }) => {
    const { t } = useTranslation()
    const { operatingMode, sisActions, datapointId } = props
    return (
      <div className={styles.info}>
        <div>
          <div className={styles.mainHead}>
            <div className={styles.leftBox}>
              <TenantLink to="/events" goBack>
                <IconButton title={t('common.back')}>
                  <Icon icon={ArrowLeft} />
                </IconButton>
              </TenantLink>
              <div className={styles.userName}>{userInfo.displayName}</div>
              <div className={styles.riskLevel}>
                <RiskLevelBlob level={riskLevel} updated={updated} fixup={fixup} />
              </div>
            </div>
            <MapViewModeSwitch showMap={showMap} onHideMap={onHideMap} onShowMap={onShowMap} />
          </div>
          <div className={styles.subHead}>{`${t('usersEvents.datapointId')}: ${datapointId}`}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.collapsible}>
            <RiskStatusTable riskLevel={riskLevel} {...props} />
          </div>
          <div className={styles.collapsible}>
            <AssignedActionTable operatingMode={operatingMode} sisActions={sisActions} />
          </div>
          <div className={styles.collapsible}>
            <UserInfoTable eEcoId={eEcoId} userInfo={userInfo} {...props} />
          </div>
        </div>
      </div>
    )
  },
)

EventInfoDetails.displayName = 'EventInfoDetails'

EventInfoDetails.propTypes = {
  onHideMap: PropTypes.func.isRequired,
  onShowMap: PropTypes.func.isRequired,
  showMap: PropTypes.bool.isRequired,
  eventId: PropTypes.string.isRequired,
  eEcoId: PropTypes.string.isRequired,
  ...RiskStatusTable.propTypes,
  ...AssignedActionTable.propTypes,
  ...UserInfoTable.propTypes,
}

export default EventInfoDetails
