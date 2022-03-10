import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@material-ui/core'

import { BasicCancel } from '@ues/assets'

import styles from './Header.module.less'
import policyStyles from './index.module.less'

export const PolicyHeader = memo(({ onCancel, title, subtitle }) => {
  const { t } = useTranslation()
  const label = useMemo(() => t('common.back'), [t])
  return (
    <>
      <div className={policyStyles.title}>
        {onCancel && (
          <IconButton title={label} onClick={onCancel}>
            <BasicCancel />
          </IconButton>
        )}

        {title}
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </>
  )
})

PolicyHeader.displayName = 'PolicyHeader'

PolicyHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onCancel: PropTypes.func,
}
