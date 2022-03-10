/* eslint-disable jsx-a11y/no-autofocus */
// dependencies
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
// components
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import {
  ArrowCaretDown,
  BasicCancel,
  BasicClose,
  BasicSearch,
  boxFlexBetweenProps,
  boxPaddingProps,
  dropdownMenuProps,
} from '@ues/assets'
import { useFilter, usePopover } from '@ues/behaviours'

// constants
const VALUE_LIST_MAX_HEIGHT = 480

const decorators = [
  storyFn => {
    const { activeFilters, onSetFilter } = useFilter()
    const placeholderMsg = 'Enter username'
    const helperTestMsg = 'Username not found.'
    const onValid = searchText => {
      return searchText.length > 3
    }

    const args = {
      valueList: [{ test: 'User1' }, { test: 'User2' }, { test: 'User3' }, { test: 'User4' }],
      activeFilters,
      onSetFilter,
      filterKey: 'test',
      label: 'Manual Search Filter',
      placeholderMsg,
      helperTestMsg,
      onValid,
    }

    return storyFn({ args })
  },
]

const QuickManualSearchComplete = ({ valueList, onAddToList, onValid, onRemoveFromList, helperTestMsg, placeholderMsg }) => {
  // utils
  const [textValue, setTextValue] = useState('')
  const [isValueValid, setValueValid] = useState(true)

  const handleClearSearchText = event => {
    event.preventDefault()
    setTextValue('')
  }

  const handleRemoveValue = name => {
    onRemoveFromList(name)
    setTextValue('')
  }

  const handleTypingText = event => {
    setValueValid(true)
    setTextValue(event.target.value)
  }

  const validateSearchText = () => {
    const trimedValue = textValue.trim()

    if (trimedValue === '') return

    if (onValid(trimedValue)) {
      setValueValid(true)
      onAddToList(trimedValue)
    } else {
      setValueValid(false)
    }

    setTextValue('')
  }

  const handleReturnEvent = event => {
    if (event.key === 'Enter') {
      validateSearchText()
    }
  }

  const handleBlurEvent = () => {
    validateSearchText()
  }

  const endAdornment = !isEmpty(textValue) ? (
    <IconButton onMouseDown={handleClearSearchText}>
      <BasicCancel />
    </IconButton>
  ) : null

  const displaySelectedValue = value => {
    const handleRemoveValueClick = () => {
      handleRemoveValue(value)
    }

    return (
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body2">{value}</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={handleRemoveValueClick}>
            <BasicClose fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    )
  }
  const helperTextContext = isValueValid ? '' : helperTestMsg

  return (
    <Box>
      <TextField
        error={!isValueValid}
        fullWidth
        autoFocus
        className="no-label"
        value={textValue}
        placeholder={placeholderMsg}
        InputProps={{
          startAdornment: <BasicSearch />,
          endAdornment,
        }}
        helperText={helperTextContext}
        onChange={handleTypingText}
        onKeyPress={handleReturnEvent}
        onBlur={handleBlurEvent}
      />
      {!isEmpty(valueList) && (
        <MenuList style={{ maxHeight: VALUE_LIST_MAX_HEIGHT }}>
          {valueList.map(item => (
            <MenuItem key={item} dense>
              {displaySelectedValue(item)}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Box>
  )
}
QuickManualSearchComplete.decorators = decorators

export const ManualSearchFilter = ({
  activeFilters,
  onSetFilter,
  filterKey: key,
  label,
  placeholderMsg,
  helperTestMsg,
  onValid,
}) => {
  const [valueList, setValueList] = useState(get(activeFilters, key, []))
  const [isSelected, setSelected] = useState(false)

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  // actions
  const onAddToList = name => {
    const newValueList = [...valueList, name]
    newValueList.sort()
    setValueList([...newValueList.filter((item, index) => newValueList.indexOf(item) === index)])

    onSetFilter({
      key,
      value: valueList,
    })
  }

  const onRemoveFromList = name => {
    setValueList([...valueList.filter(item => item !== name)])
  }

  const onClose = () => {
    setSelected(false)
    handlePopoverClose()
  }

  // utils
  const chipLabel = isEmpty(valueList) ? (
    <Box {...boxFlexBetweenProps}>
      <Box>
        <Typography variant="body2">Username</Typography>
      </Box>
      <ArrowCaretDown className="popover-chip-caret-down" />
    </Box>
  ) : (
    <Typography variant="body2">{`Username +${valueList.length}`}</Typography>
  )

  const onDelete = () => {
    setValueList([])
  }

  const onClick = event => {
    setSelected(true)
    handlePopoverClick(event)
  }

  const renderFilterChip = () => (
    <Chip
      label={chipLabel}
      variant="outlined"
      onClick={onClick}
      {...(!isEmpty(valueList) && { onDelete: onDelete })}
      deleteIcon={<BasicCancel />}
      className={isSelected ? 'chip-selected' : ''}
    />
  )
  return (
    <>
      {renderFilterChip()}
      <Popover
        open={popoverIsOpen}
        anchorEl={popoverAnchorEl}
        onClose={onClose}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'quick-search-filter',
        }}
      >
        <Box {...boxFlexBetweenProps} {...boxPaddingProps} pt={3}>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>
        <Box {...boxPaddingProps} pb={4}>
          <QuickManualSearchComplete
            onAddToList={onAddToList}
            onRemoveFromList={onRemoveFromList}
            onValid={onValid}
            valueList={valueList}
            helperTestMsg={helperTestMsg}
            placeholderMsg={placeholderMsg}
          />
        </Box>
      </Popover>
    </>
  )
}
ManualSearchFilter.decorators = decorators
