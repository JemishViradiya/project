/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FC } from 'react'
import React, { memo, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import type { DashboardTime } from '../types'

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: '150px',
    marginBottom: 0,
  },
  menuList: {
    paddingTop: theme.spacing(2),
  },
  menuPaper: {
    width: '200px',
    marginTop: theme.spacing(0.5),
  },
  select: {
    display: 'flex',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    height: '1.875rem',
    textAlign: 'center',
    alignItems: 'center',
    border: '1px solid',
    borderColor: theme.palette.grey[400],
    borderRadius: theme.spacing(0.5),
  },
  selectMenu: {
    maxHeight: '400px',
    ...theme.typography.body2,
  },
  selectIcon: {
    right: '4px',
    top: '4px',
  },
}))

type SelectMenuProps = {
  initValue?: DashboardTime
  testid?: string
  onValueChange(string): void
}

export const SelectMenu: FC<SelectMenuProps> = memo(props => {
  const styles = useStyles()
  const { initValue, testid, onValueChange, children } = props

  const [value, setValue] = useState(initValue.timeInterval)

  const onChange = event => {
    setValue(event.target.value)
    onValueChange(event.target.value)
  }

  return (
    <FormControl className={styles.formControl}>
      <Select
        disableUnderline
        variant="standard"
        value={value}
        onChange={onChange}
        name="select"
        data-testid={testid}
        classes={{
          select: styles.select,
          selectMenu: styles.selectMenu,
          icon: styles.selectIcon,
        }}
        MenuProps={{
          disableScrollLock: true,
          elevation: 4,
          className: styles.selectMenu,
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          classes: {
            list: styles.menuList,
            paper: styles.menuPaper,
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  )
})
