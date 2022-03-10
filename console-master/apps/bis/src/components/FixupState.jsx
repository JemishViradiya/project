import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './FixupState.module.less'

const FixupState = memo(({ fixup }) => {
  const { t } = useTranslation()
  if (!fixup || fixup === 'not_applicable') {
    return null
  }
  return (
    <div>
      <div>{t(`risk.challengeState.type.${fixup}`)}</div>
      <div className={styles.subtext}>{t(`risk.challengeState.message.${fixup}`)}</div>
    </div>
  )
})

FixupState.propTypes = {
  fixup: PropTypes.string,
}
FixupState.displayName = 'FixupState'

export default FixupState
