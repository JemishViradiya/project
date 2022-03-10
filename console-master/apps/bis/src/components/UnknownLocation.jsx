import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useSubscribeByDefault from '../providers/SubscribeByDefaultProvider'
import styles from './UnknownLocation.module.less'

export const UnknownLocationInfo = ({ count, onClick }) => {
  const { t } = useTranslation()
  return (
    <div role="button" tabIndex="-1" className={styles.info} onClick={onClick}>
      {t('usersEvents.unknownLocationCount', { count })}
    </div>
  )
}

const UnknownLocation = ({ query, variables, dataAccessor, onClick }) => {
  const provider = useCallback(
    ({ loading, error, data }) => {
      if (error || loading) return null
      const count = dataAccessor(data)
      return count > 0 ? <UnknownLocationInfo count={count} onClick={onClick} /> : null
    },
    [dataAccessor, onClick],
  )

  const value = useSubscribeByDefault(query, {
    variables,
  })
  return provider(value)
}
UnknownLocation.displayName = 'UnknownLocation'

export default UnknownLocation
