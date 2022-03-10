import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import StateProvider from '../providers/StateProvider'
import UserCountProvider from '../providers/UserCountProvider'
import styles from './Common.module.less'

const useRenderDataFn = () => {
  const { t } = useTranslation()

  return useCallback(
    ({ data }) => {
      if (!data) {
        return null
      }

      return (
        <span className={styles.counter} aria-label={t('dashboard.totalActiveUsersCounter')}>
          {data.userCount}
        </span>
      )
    },
    [t],
  )
}
const UserCount = memo(({ range }) => {
  const variables = { range }

  return (
    <UserCountProvider variables={variables}>
      <UserCountProvider.Consumer>{useRenderDataFn()}</UserCountProvider.Consumer>
    </UserCountProvider>
  )
})

const renderStateConsumer = ({ currentTimePeriod: range }) => <UserCount range={range} />

const UserCounter = memo(() => {
  return <StateProvider.Consumer>{renderStateConsumer}</StateProvider.Consumer>
})

export default UserCounter
