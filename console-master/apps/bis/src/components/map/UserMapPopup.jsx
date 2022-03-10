import moment from 'moment'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import { BasicClose } from '@ues/assets'

import { environment } from '../../environments/environment'
import MapContext from '../../googleMaps/Context'
import AddressLookupProvider from '../../providers/AddressLookupProvider'
import { Context as UserInfoContext } from '../../providers/UserRiskEventProvider'
import Action from '../Action'
import Avatar from '../Avatar'
import HelpTip from '../HelpTip'
import useClientParams from '../hooks/useClientParams'
import { Icon } from '../icons/Icon'
import IconButton from '../widgets/IconButton'
import MessageSnackbar from '../widgets/MessageSnackbar'
import styles from './UserMapPopup.module.less'

const mapConfig = environment.map
const STREETVIEW_MAX_RADIUS = (mapConfig && mapConfig.streetView && mapConfig.streetView.maxRadius) || 100

export const UserProfile = memo(({ userInfo }) => {
  let title
  if (userInfo.title && userInfo.department) {
    title = `${userInfo.title}, ${userInfo.department}`
  } else if (userInfo.title) {
    title = userInfo.title
  } else {
    title = userInfo.department || ''
  }
  return (
    <>
      <Typography variant="h3">{userInfo.displayName}</Typography>
      {title ? <Typography variant="caption">{title}</Typography> : null}
    </>
  )
})

export const Actions = memo(({ operatingMode, sisActions, t }) => {
  if (!sisActions.actions || sisActions.actions.length === 0) {
    return null
  }
  return (
    <div>
      <div className={styles.actionTitle}>{t('usersEvents.assignedAction')}</div>
      <Action operatingMode={operatingMode} sisActions={sisActions} oneColumn />
    </div>
  )
})

const UserMapPopup = memo(({ user, onClose, noStreetView }) => {
  const { privacyMode } = useClientParams()
  const privacyModeOn = privacyMode && privacyMode.mode
  const [snackbar, setSnackbar] = useState({ show: false })
  const [streetViewInfoLoading, setStreetViewInfoLoading] = useState(false)
  const { t } = useTranslation()
  const { data: { userInfo: info } = {} } = useContext(UserInfoContext)
  const { google, map } = useContext(MapContext)
  const userInfo = user.info || info
  const openStreetView = useCallback(() => {
    if (google && map) {
      const { lat, lon: lng } = user.assessment.location
      const latLng = new google.maps.LatLng(lat, lng)

      // Check if street view exists for this location.
      const streetViewService = new google.maps.StreetViewService()
      const locationRequest = {
        location: latLng,
        preference: google.maps.StreetViewPreference.NEAREST,
        radius: STREETVIEW_MAX_RADIUS,
        source: google.maps.StreetViewSource.DEFAULT,
      }
      setStreetViewInfoLoading(true)
      streetViewService.getPanorama(locationRequest, (panoramaData, status) => {
        setStreetViewInfoLoading(false)
        switch (status) {
          case google.maps.StreetViewStatus.OK: {
            const streetView = map.getStreetView()
            streetView.setPosition(panoramaData.location.latLng)
            streetView.setPov({
              heading: 0,
              pitch: 0,
            })
            streetView.setVisible(true)
            break
          }
          case google.maps.StreetViewStatus.ZERO_RESULTS:
            setSnackbar({
              show: true,
              message: t('map.streetViewErrorRadius', { radius: STREETVIEW_MAX_RADIUS }),
            })
            break
          case google.maps.StreetViewStatus.UNKNOWN_ERROR:
          default:
            setSnackbar({
              show: true,
              message: t('map.streetViewErrorUnknown'),
            })
            break
        }
      })
    }
  }, [google, map, t, user.assessment.location])
  const onCloseModal = useCallback(() => {
    setSnackbar({ show: false })
  }, [setSnackbar])
  let device = ''
  if (user.assessment.datapoint && user.assessment.datapoint.source && user.assessment.datapoint.source.deviceModel) {
    device = t('user.usingDeviceModel', { deviceModel: user.assessment.datapoint.source.deviceModel })
  }

  const streetViewButton = useMemo(() => {
    return (
      <div className={styles.buttonBar}>
        <Button variant="contained" color="primary" onClick={openStreetView} loading={streetViewInfoLoading}>
          {t('map.streetView')}
        </Button>
        {snackbar.message && (
          <MessageSnackbar open={snackbar.show} message={snackbar.message} onClose={onCloseModal} variant="error" />
        )}
      </div>
    )
  }, [streetViewInfoLoading, onCloseModal, openStreetView, snackbar.message, snackbar.show, t])

  const { definedgeozone } = user.assessment.mappings || {}
  const geozoneName = (definedgeozone && definedgeozone.meta && definedgeozone.meta.geozoneName) || undefined

  return (
    <>
      <div className={styles.topBox} risk={user.riskLevel}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            <Avatar userInfo={userInfo} />
          </div>
          <div className={styles.userData}>
            <UserProfile userInfo={userInfo} />
            <div className={styles.emptyRow} />
            <Typography variant="caption" style={{ display: 'block' }}>
              {moment(user.assessment.datetime).fromNow()} {device}
            </Typography>
            <Typography variant="caption" style={{ display: 'block' }}>
              <AddressLookupProvider location={user.assessment.location} />
            </Typography>
            {user.assessment.ipAddress && (
              <Typography variant="caption" style={{ display: 'block' }}>
                {t('common.ipAddressField', { ip: user.assessment.ipAddress })}
              </Typography>
            )}
          </div>
        </div>
        <IconButton className={styles.closeButton} size="small" onClick={onClose} title={t('common.close')} color="secondary">
          <Icon icon={BasicClose} />
        </IconButton>
      </div>
      <div className={styles.bottomBox}>
        <div className={styles.riskContainer}>
          <div className={styles.riskBox}>
            <Typography variant="body1">
              <HelpTip
                wrappedText={t('risk.common.identityRisk')}
                helpText={t('common.assessmentOfRiskBasedOnUserTypicalActivities')}
              />
            </Typography>
            <div className={styles.riskValue} risk={user.assessment.behavioralRiskLevel}>
              {t(`risk.level.${user.assessment.behavioralRiskLevel}`)}
            </div>
          </div>
          <div className={styles.riskBox}>
            <Typography variant="body1">
              <HelpTip wrappedText={t('common.geozoneRisk')} helpText={t('common.assessmentOfRiskBasedOnUserProximity')} />
            </Typography>
            <div className={styles.riskValue} risk={user.assessment.geozoneRiskLevel}>
              {t(`risk.level.${user.assessment.geozoneRiskLevel}`)}
              {geozoneName ? ` - ${geozoneName}` : ''}
            </div>
          </div>
        </div>
        <Actions t={t} operatingMode={user.operatingMode} sisActions={user.sisActions || {}} />
        {privacyModeOn || noStreetView ? null : streetViewButton}
      </div>
    </>
  )
})

UserMapPopup.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  noStreetView: PropTypes.bool,
}
UserMapPopup.displayName = 'UserMapPopup'

export default UserMapPopup
