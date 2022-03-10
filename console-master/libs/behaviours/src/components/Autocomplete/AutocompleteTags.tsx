// dependencies
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Popper } from '@material-ui/core'
// components
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { ArrowCaretDown } from '@ues/assets'

import { useAutocompleteTags } from './hooks'
import { useStyles } from './styles'

interface AutocompleteProps {
  tags: Array<string>
  addedTags: Array<string>
  handleAddTags: (newTags: Array<string>) => void
  label?: string
}

export const AutocompleteTags: React.FC<AutocompleteProps> = ({ tags, addedTags, handleAddTags, label }) => {
  const styles = useStyles()
  const { t } = useTranslation(['components'])
  const isHighlightedRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [currentTags, setCurrentTags] = useState(tags)
  const [userInput, setUserInput] = useState('')
  const [isOnNewTagOption, setIsOnNewTagOption] = useState(false)
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: string) => option,
  })

  const {
    toggleOpen,
    handleOnChange,
    addNewTagWithNoOptions,
    keyAddCheck,
    currentTagsSorted,
    isInAddedTags,
    isItStartsWithCurrentTagsWithoutAdded,
    isInCurrentTagsWithoutAdded,
    onClose,
    onTagsChange,
  } = useAutocompleteTags({
    setOpen,
    open,
    currentTags,
    setCurrentTags,
    setUserInput,
    handleAddTags,
    addedTags,
    userInput,
    isOnNewTagOption,
    isHighlightedRef,
  })

  const PopperAutocomplete = props => {
    return (
      <Popper {...props} className={styles.poper}>
        {props.children}
        {userInput.length > 0 && isItStartsWithCurrentTagsWithoutAdded && !isInCurrentTagsWithoutAdded && (
          <Paper className={styles.newTagPaper} onClick={addNewTagWithNoOptions}>
            <NoOptionsAutocomplete isFromPopper={true} />
          </Paper>
        )}
      </Popper>
    )
  }

  const PaperAutocomplete = props => {
    return <Paper {...props} className={styles.paper} />
  }

  const boldTextChanger = option => {
    return (
      <div className={styles.optionsText}>
        <span className={styles.boldText}>{option.substr(0, userInput.length)}</span>
        <span>{option.substr(userInput.length, option.length - userInput.length)}</span>
      </div>
    )
  }

  const NoOptionsAutocomplete = props => {
    if (!props.isFromPopper) {
      isHighlightedRef.current = false
    }
    return (
      <div onMouseEnter={() => setIsOnNewTagOption(true)} onMouseLeave={() => setIsOnNewTagOption(false)}>
        <Typography onClick={addNewTagWithNoOptions} className={props.isFromPopper ? styles.newTagPaper : styles.noOptions}>
          {!isInAddedTags ? `${userInput} (${t('autocompleteTags.newTag')})` : `${t('autocompleteTags.tagAlreadyExist')}`}
        </Typography>
      </div>
    )
  }

  return (
    <Autocomplete
      multiple
      autoHighlight={false}
      open={open}
      onClose={onClose}
      filterOptions={filterOptions}
      options={currentTagsSorted}
      includeInputInList={true}
      onHighlightChange={(event, val) => (val === null ? (isHighlightedRef.current = false) : (isHighlightedRef.current = true))}
      getOptionLabel={option => option}
      renderOption={option => boldTextChanger(option)}
      popupIcon={<ArrowCaretDown onClick={toggleOpen} />}
      disableClearable={true}
      filterSelectedOptions={true}
      disableCloseOnSelect
      value={addedTags}
      PaperComponent={PaperAutocomplete}
      PopperComponent={PopperAutocomplete}
      inputValue={userInput}
      classes={{ input: styles.chip, listbox: styles.listBox, root: !label && styles.root }}
      onChange={onTagsChange}
      noOptionsText={userInput.length > 0 && <NoOptionsAutocomplete isFromPopper={false} />}
      renderTags={(value, getTagProps) => (
        <div>
          {value.map((option, index) => (
            <Chip
              key={option}
              className={styles.chip}
              variant="outlined"
              size="small"
              label={<Typography variant="caption">{option}</Typography>}
              {...getTagProps({ index })}
            />
          ))}
        </div>
      )}
      renderInput={params => (
        <TextField
          {...params}
          onChange={handleOnChange}
          value={userInput}
          InputLabelProps={{
            classes: {
              root: styles.textFieldLabel,
            },
          }}
          variant="filled"
          size="small"
          label={label}
          onKeyDown={keyAddCheck}
        />
      )}
    />
  )
}
