import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Placeholder.module.less'

const Placeholder = memo(({ width, height, graphic, heading, description }) => {
  const { t } = useTranslation()

  const shape = width > 310 ? styles.wide : styles.tall

  return (
    <div className={styles.placeholder} style={{ height }}>
      <div className={shape}>
        <div className={styles.space} />
        <img className={styles.graphic} src={graphic} alt="" />
        <div className={styles.text}>
          <span className={styles.heading}>{t(heading)}</span>
          <span className={styles.description}>{t(description)}</span>
        </div>
        <div className={styles.space} />
      </div>
    </div>
  )
})

export default Placeholder
