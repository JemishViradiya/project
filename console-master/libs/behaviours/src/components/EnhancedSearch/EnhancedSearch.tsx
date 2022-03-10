//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import cn from 'classnames'
import type { ChangeEvent } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, IconButton, Paper, Popper } from '@material-ui/core'
import type { AutocompleteInputChangeReason } from '@material-ui/lab'
import { Autocomplete } from '@material-ui/lab'

import { BasicClose, BasicSearch } from '@ues/assets'

import type { FILTER_TYPES } from '../../filters'
import { ChipRenderer } from './components/ChipRenderer'
import { InputRenderer } from './components/InputRenderer'
import { OptionRenderer } from './components/OptionRenderer'
import { EnhancedSearchProvider, useEnhancedSearchContext } from './EnhancedSearchProvider'
import { useEnhancementSearchHook, useExternalValues } from './hooks'
import useStyles from './styles'
import type { EnhancedSearchChip, EnhancedSearchProps } from './types'
import { SearchStep } from './types'

const EnhancedSearchComponent: React.FC<EnhancedSearchProps> = ({
  disabled,
  fields,
  condensed = false,
  showChipSeparator = false,
  onChange,
  asyncFieldsProps,
  placeholder,
  autoFocus,
  externalValues,
}) => {
  const {
    state: { selectedFieldIndex, step, optionsShow, searchValue, options = [{ label: '' }], values },
    dispatch,
  } = useEnhancedSearchContext()

  const { t } = useTranslation(['components', 'tables'])
  const currentField = values[selectedFieldIndex]

  const searchRefs = useRef(null)
  const inputRef = useRef(null)
  const optionRef = useRef(null)

  const [selectedChipRef, setSelectedChipRef] = useState(null)

  useExternalValues(externalValues, fields, dispatch)

  useEffect(() => {
    if (step === SearchStep.Second && inputRef?.current) {
      inputRef.current.focus()
    }
  }, [step, inputRef])

  const {
    handleChange,
    handleSearch,
    handleDeleteChip,
    handleEditChip,
    handleClose,
    handleDeleteAllChips,
    handleOptionValueChange,
  } = useEnhancementSearchHook({
    optionRef,
    fields,
    disabled,
    step,
    dispatch,
    onChange,
    values,
    selectedFieldIndex,
    searchRefs,
    optionsShow,
  })

  const classes = useStyles({
    condensed,
    isStandardList: step === SearchStep.Third,
  })

  const handleInputChange = (event: ChangeEvent<{ value: string }>, value: string, reason: AutocompleteInputChangeReason) => {
    handleSearch({
      event,
      reason,
      step,
      type: currentField?.type as FILTER_TYPES,
    })
  }

  const filterOptions = _options => {
    const regexp = new RegExp(searchValue.toLocaleLowerCase(), 'gi')
    if (step === SearchStep.Third) {
      return [{ label: '' }]
    }
    return _options.filter(option => {
      return option?.label?.match(regexp) || option?.value?.match(regexp)
    })
  }

  return (
    <Box className={classes.box}>
      <Paper
        elevation={10}
        square
        className={cn({ [classes.searchContainer]: true, [classes.searchContainerInputType]: condensed })}
      >
        {!condensed && (
          <IconButton disabled className={classes.searchIcon}>
            <BasicSearch />
          </IconButton>
        )}
        <Autocomplete
          ref={searchRefs}
          open={optionsShow && !disabled}
          inputValue={searchValue}
          value={values}
          options={options}
          disabled={disabled}
          onClose={handleClose}
          onInputChange={handleInputChange}
          onChange={handleChange}
          getOptionLabel={({ label }) => label}
          filterOptions={filterOptions}
          getOptionDisabled={(option: EnhancedSearchChip) => {
            if (!option.allowDuplicate) {
              return values.some(({ dataKey }) => dataKey === option.dataKey)
            } else {
              return false
            }
          }}
          renderTags={value => (
            <ChipRenderer
              value={value}
              classes={classes}
              showChipSeparator={showChipSeparator}
              disabled={disabled}
              handleEditChip={handleEditChip}
              handleDeleteChip={handleDeleteChip}
              setSelectedChipRef={setSelectedChipRef}
            />
          )}
          PopperComponent={props => (
            <Popper {...props} anchorEl={selectedChipRef || inputRef.current} style={{ width: '100px' }} placement="bottom-start" />
          )}
          renderInput={params => (
            // eslint-disable-next-line jsx-a11y/no-autofocus
            <InputRenderer params={params} classes={classes} placeholder={placeholder} autoFocus={autoFocus} inputRef={inputRef} />
          )}
          renderOption={option => (
            <OptionRenderer
              option={option}
              classes={classes}
              currentField={currentField}
              optionRef={optionRef}
              handleOptionValueChange={handleOptionValueChange}
              asyncFieldsProps={asyncFieldsProps}
            />
          )}
          noOptionsText={t('enhancedSearch.noOptionsText')}
          multiple
          disableCloseOnSelect
          includeInputInList
          autoHighlight
          className={classes.base}
          classes={{
            option: classes.option,
            listbox: classes.list,
            paper: classes.paper,
            input: classes.input,
            popper: classes.popperList,
          }}
        />
        {!condensed && (
          <IconButton className={classes.closeSearch} onClick={handleDeleteAllChips} disabled={disabled}>
            <BasicClose />
          </IconButton>
        )}
      </Paper>
    </Box>
  )
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = props => {
  return (
    <EnhancedSearchProvider {...props}>
      <EnhancedSearchComponent {...props} />
    </EnhancedSearchProvider>
  )
}
