import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicGroupUser } from '@ues/assets'

import { Icon } from '../../components/icons/Icon'
import styles from './Directory.module.less'

export const DirectoryUser = memo(({ displayName, primaryEmail, username }) => {
  const { t } = useTranslation()
  if (primaryEmail) {
    if (username) {
      return `${displayName} (${primaryEmail}, ${username})`
    }
    return `${displayName} (${primaryEmail})`
  } else if (username) {
    return `${displayName}, ${username})`
  }
  return displayName || t('common.unknownUser')
})
DirectoryUser.displayName = 'DirectoryUser'

export const DirectoryUserName = memo(({ displayName, username }) => {
  const { t } = useTranslation()
  return displayName || username || t('common.unknownUser')
})
DirectoryUserName.displayName = 'DirectoryUserName'

export const DirectoryGroup = memo(({ name }) => {
  const { t } = useTranslation()
  return (
    <>
      <Icon icon={BasicGroupUser} aria-label={t('common.group')} className={styles.groupIcon} />
      {name || t('common.unknownGroup')}
    </>
  )
})
DirectoryGroup.displayName = 'DirectoryGroup'
