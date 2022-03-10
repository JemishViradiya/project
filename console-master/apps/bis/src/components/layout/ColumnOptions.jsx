import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import styles from './InfiniteList.module.less'

const ColumnOptions = memo(({ headers, onMenuCheckbox }) => {
  const { t } = useTranslation()
  const sections = { 'common.list.all': [] }

  Object.values(headers).forEach(header => {
    const control = (
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            className={styles.checkbox}
            checked={header.visible}
            disabled={header.disabled}
            onChange={e => onMenuCheckbox(e, header)}
            inputProps={{ 'aria-label': t(header.columnName) }}
          />
        }
        label={t(header.columnName)}
        key={header.dataKey}
        className={styles.row}
        disabled={header.disabled}
      />
    )
    if (header.section) {
      if (!sections[header.section]) {
        sections[header.section] = []
      }
      sections[header.section].push(control)
    } else {
      sections['common.list.all'].push(control)
    }
  })

  const options = []
  Object.keys(sections).forEach(name => {
    if (sections[name].length > 0) {
      const translatedName = t(name)
      options.push(
        <section aria-label={translatedName} className={styles.section} key={name}>
          <header className={styles.label}>{translatedName}</header>
          <div role="list" className={styles.sectionContent}>
            {sections[name]}
          </div>
        </section>,
      )
    }
  })
  if (options.length > 1) {
    return <div className={styles.allSections}>{options}</div>
  } else {
    return <div className={styles.oneSection}>{options}</div>
  }
})

ColumnOptions.propTypes = {
  headers: PropTypes.object.isRequired,
  onMenuCheckbox: PropTypes.func.isRequired,
}

ColumnOptions.displayName = 'ColumnOptions'

export default ColumnOptions
