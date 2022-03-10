/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import cn from 'clsx'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import { BasicSearch } from '@ues/assets'

import styles from './SearchBox.module.less'

export const SearchBox = memo(({ updateQuery }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const [showField, setShowField] = useState(false)
  let timer = null

  const onSearchChange = event => {
    const value = event.target.value
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      updateQuery(value)
    }, 300)
  }

  const handleClick = () => {
    setShowField(!showField)
  }

  return (
    <div className={styles.searchContainer}>
      <TextField
        placeholder={t('general/form:commonLabels.search')}
        onChange={onSearchChange}
        size="small"
        className={cn(styles.search, !showField && styles.hideSearch)}
      />
      <div className={styles.searchButton}>
        <IconButton aria-label={t('general/form:commonLabels.search')} onClick={handleClick}>
          <BasicSearch />
        </IconButton>
      </div>
    </div>
  )
})
