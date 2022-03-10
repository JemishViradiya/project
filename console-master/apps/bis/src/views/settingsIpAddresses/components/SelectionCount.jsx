import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { renderStyle as HeaderStyle } from '../../../list/Header'

const SelectionCount = memo(({ count }) => {
  const { t } = useTranslation()

  if (count === 0) {
    return null
  }
  return (
    <span className={HeaderStyle.selectionCount} aria-label={t('settings.ipAddress.selectedAriaLabel')}>
      {t('common.selectedItemsCount', { count })}
    </span>
  )
})

SelectionCount.displayName = 'SelectionCount'

SelectionCount.propTypes = {
  count: PropTypes.number.isRequired,
}

export default SelectionCount
