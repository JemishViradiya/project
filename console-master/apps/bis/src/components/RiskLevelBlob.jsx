import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { BasicBolt } from '@ues/assets'

import { Icon } from './icons/Icon'
import styles from './RiskLevelBlob.module.less'

const RiskLevelBlob = memo(({ level, updated, fixup }) => {
  const { t } = useTranslation()
  return (
    <div className={styles[level]} aria-label={t(`risk.blob.${level?.toLowerCase()}`)}>
      {updated && fixup === 'valid' ? <Icon className={styles.icon} icon={BasicBolt} /> : null} {t(`risk.level.${level}`)}
    </div>
  )
})

RiskLevelBlob.displayName = 'RiskLevelBlob'
RiskLevelBlob.propTypes = {
  level: PropTypes.string.isRequired,
  updated: PropTypes.bool,
}

export default RiskLevelBlob
