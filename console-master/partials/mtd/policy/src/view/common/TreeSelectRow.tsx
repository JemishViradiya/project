/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import type { Node } from 'react-virtualized-tree'

import { Button, Checkbox, FormControl, FormControlLabel, makeStyles } from '@material-ui/core'

import { ArrowChevronDown, ArrowChevronUp } from '@ues/assets'

export interface TreeSelectItem extends Node {
  value?: any
  parent?: TreeSelectItem
  disabled?: boolean
  extra?: React.ReactNode
  labelComponent?: React.ReactNode
}

export interface TreeSelectRowProps {
  item: Node
  handleToggle?: (id: string, value: Node) => () => void
  checked: boolean
  indeterminate: boolean
  readOnly?: boolean
  dropdownClick: () => void
  labelClasses: Record<string, string>
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(2),
    '& .MuiPaper-root': {
      borderColor: 'unset',
      backgroundColor: 'unset',
    },
    '& .MuiButton-text': {
      borderColor: 'unset',
      backgroundColor: 'unset',
    },
  },
  formControl: {
    marginBottom: 0,
  },
}))

const TreeSelectRow: React.FC<TreeSelectRowProps> = ({
  item,
  handleToggle,
  checked,
  indeterminate,
  readOnly = false,
  dropdownClick,
  labelClasses,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root} role="row" aria-label={String(item.id)}>
      <Button
        variant="text"
        className="expandListButton"
        style={{ visibility: item.children?.length ? 'visible' : 'hidden' }}
        aria-label={String(item.id)}
        onClick={() => {
          dropdownClick()
        }}
      >
        {item.state.expanded ? <ArrowChevronUp /> : <ArrowChevronDown />}
      </Button>

      <FormControl className={classes.formControl} disabled={readOnly}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              tabIndex={-1}
              disableRipple
              disabled={readOnly}
              indeterminate={indeterminate}
              inputProps={{ 'aria-label': String(item.id) }}
              onClick={() => {
                handleToggle(String(item.id), item)()
              }}
            />
          }
          label={item.name}
          classes={labelClasses}
        />
      </FormControl>
    </div>
  )
}

export default TreeSelectRow
