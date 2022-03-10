import cn from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import AddressLookupProvider from '../../../providers/AddressLookupProvider'
import { CollapsibleInfo, SimpleTable, useClientParams } from '../../../shared'
import styles from './UserInfoTable.module.less'

const columns = [{ width: 112, accessor: 'name' }, { accessor: 'content' }]

const addTextLine = (text, key, styleClass) => (
  <div className={cn(styles.textLine, styleClass)} key={key}>
    {text}
  </div>
)

const addKeyValueLine = (key, valueOrFn, reactKey, styleClass) => {
  let value = valueOrFn
  if (typeof valueOrFn === 'function') {
    ;[value, styleClass] = valueOrFn()
  }
  if (!value) {
    return null
  }
  return (
    <div className={cn(styles.textLine, styleClass)} key={reactKey}>
      {key}: {value}
    </div>
  )
}

const getAppInfo = source => {
  const appVersion = source.appVersion ? `(${source.appVersion})` : ''
  const app = source.appName ? `${source.appName} ${appVersion}` : ''
  return addTextLine(app)
}

const getTimeInfo = datetime => addTextLine(moment(datetime).format('MMM D, YYYY h:mma'))

const getUserInfo = (userId, userInfo, t) => (
  <div>
    {addKeyValueLine(t('common.name'), userInfo.displayName)}
    {addKeyValueLine(t('common.email'), userInfo.primaryEmail)}
    {addKeyValueLine(t('user.title'), userInfo.title)}
    {addKeyValueLine(t('user.department'), userInfo.department)}
    {addKeyValueLine(t('user.userId'), userId)}
    {addKeyValueLine(t('user.username'), userInfo.username)}
  </div>
)

const getDeviceInfo = (source, t) => {
  const getDeviceType = () => {
    if (source.deviceType) {
      return [source.deviceType.toLowerCase(), styles.capitalize]
    }
    return [null]
  }

  const getOS = () => {
    if (!source.os) {
      return [null]
    }

    const osVersion = source.osVersion || ''
    if (source.os.toUpperCase() === 'IOS') {
      return [`iOS ${osVersion}`]
    } else {
      return [`${source.os.toLowerCase()} ${osVersion}`, styles.capitalize]
    }
  }

  return (
    <div>
      {addKeyValueLine(t('user.device.model'), source.deviceModel, 'model')}
      {addKeyValueLine(t('user.device.type'), getDeviceType, 'type')}
      {addKeyValueLine(t('user.device.os'), getOS, 'os')}
      {addKeyValueLine(t('user.device.localTimezone'), source.timezone, 'timezone')}
    </div>
  )
}

const getIpInfo = ip => <div>{ip}</div>

const getAddressInfo = (location, noLatLon) => (
  <div>
    <div className={styles.textLine}>
      <AddressLookupProvider location={location} />
    </div>
    {noLatLon ? null : addTextLine(`${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}`)}
  </div>
)

const UserInfoTable = memo(({ eEcoId, userInfo, datetime, location, ipAddress, source }) => {
  const { t } = useTranslation()
  const { privacyMode: { mode: privacyMode = true } = {} } = useClientParams() || {}

  const data = [
    { name: t('usersEvents.appOrService'), content: getAppInfo(source) },
    { name: t('common.time'), content: getTimeInfo(datetime) },
    { name: t('common.user'), content: getUserInfo(eEcoId, userInfo, t) },
    { name: t('usersEvents.accessDevice'), content: getDeviceInfo(source, t) },
  ]
  if (ipAddress) {
    data.push({ name: t('common.ipAddress'), content: getIpInfo(ipAddress) })
  }
  if (location && location.lat && location.lon) {
    data.push({ name: t('user.address'), content: getAddressInfo(location, privacyMode) })
  }
  return (
    <CollapsibleInfo title={t('usersEvents.userInformation')}>
      <SimpleTable columns={columns} data={data} />
    </CollapsibleInfo>
  )
})

UserInfoTable.propTypes = {
  eEcoId: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,
  datetime: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  ipAddress: PropTypes.string,
  source: PropTypes.object.isRequired,
}

export default UserInfoTable
