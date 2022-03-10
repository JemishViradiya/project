import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './TopItems.module.less'

// Assume we use label font size (i.e. 20px) for displaying numbers in less file.
// The digit letter width is roughly 12px.
const LetterWidth = 12
const LetterSpaceRatio = 0.025

const getNumberWidth = n => {
  const digits = n.toString().length
  return (digits + (digits - 1) * LetterSpaceRatio) * LetterWidth + 8
}

const TopItem = memo(({ title, total, maxTotal, boxStyle, spanStyle }) => {
  const { t } = useTranslation()
  const style = useMemo(() => ({ width: `${(total * 100) / maxTotal}%` }), [total, maxTotal])
  const label = useMemo(() => `${t('dashboard.topAction')} - ${total} ${title}`, [t, total, title])
  return (
    <div className={styles.item} aria-label={label}>
      <div className={styles.title}>{title}</div>
      <div className={styles.box} style={boxStyle}>
        <div className={styles.bar} style={style} />
        <span className={styles.total} style={spanStyle}>
          {total}
        </span>
      </div>
    </div>
  )
})

const TopItems = ({ items }) => {
  const maxTotal = items[0] ? items[0].total : 0
  const boxStyle = useMemo(() => ({ marginRight: getNumberWidth(maxTotal) }), [maxTotal])
  const spanStyle = useMemo(() => ({ marginRight: -boxStyle.marginRight }), [boxStyle.marginRight])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <TopItem key={index} maxTotal={maxTotal} boxStyle={boxStyle} spanStyle={spanStyle} {...item} />
      ))}
    </div>
  )
}

TopItems.propTypes = {
  // Items should be sorted already (descending according to total)
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ).isRequired,
}
TopItems.displayName = 'TopItems'

export default TopItems
