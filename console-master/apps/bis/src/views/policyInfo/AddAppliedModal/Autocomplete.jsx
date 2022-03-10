import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { BasicSearch } from '@ues/assets'

import { Context } from '../../../providers/UserAndGroupByQueryProvider'
import { DirectoryGroup, DirectoryUser, Icon, Loading, useToggle } from '../../../shared'
import styles from './Autocomplete.module.less'

const AUTOCOMPLETE_MIN_LENGTH = 3
const EMPTY_ARRAY = []
const AUTOCOMPLETE_VALUE = process.env.NODE_CONFIG_ENV === 'test' ? undefined : { id: '' }
const COMMON_SEARCH = 'common.search'

const EndAdornment = memo(({ isEmpty, onSearchIconClick, loading }) => {
  const { t } = useTranslation()
  const searchIconStyle = cn(styles.searchIcon, !isEmpty ? styles.disabled : '')

  return (
    <div className={styles.searchIconContainer} role="button" title={t(COMMON_SEARCH)} aria-label={t(COMMON_SEARCH)}>
      {loading ? (
        <Loading color="inherit" size={18} />
      ) : (
        <Icon icon={BasicSearch} className={searchIconStyle} onClick={onSearchIconClick} />
      )}
    </div>
  )
})

const AutocompleteInput = memo(({ InputProps, handleOnInputChange, onSearchIconClick, loading, error, ...rest }) => {
  const { t } = useTranslation()
  const label = error ? t('common.errorPleaseRetry') : t(COMMON_SEARCH)
  const isEmpty = rest.inputProps.value.length > 0
  const inputPropsValue = useMemo(
    () => ({
      ...InputProps,
      endAdornment: <EndAdornment isEmpty={isEmpty} onSearchIconClick={onSearchIconClick} loading={loading} />,
    }),
    [InputProps, isEmpty, onSearchIconClick, loading],
  )
  return (
    <TextField
      autoFocus // eslint-disable-line jsx-a11y/no-autofocus
      {...rest}
      error={error}
      label={label}
      fullWidth
      margin="normal"
      onChange={handleOnInputChange}
      InputProps={inputPropsValue}
      aria-describedby="autocomplete-desc"
    />
  )
})

const getOptionLabel = option => option.id

const renderOption = option => {
  if (option.__typename === 'BIS_DirectoryGroup') {
    return <DirectoryGroup key={`group:${option.id}`} {...option.info} />
  }
  return <DirectoryUser key={`user:${option.id}`} {...option.info} />
}

const filterOptions = options => options
const filterAlreadyApplied = ({ id, __typename }) => applied => applied.id === id && applied.__typename === __typename

const emptyInputValue = ''

const AutocompleteComponent = memo(({ addAppliedItem, setSearchText, appliedData, alreadyApplied }) => {
  const { data, loading, error } = useContext(Context)
  const [open, toggleOpen, setOpen] = useToggle(false)
  const [inputValue, setInputValue] = useState(emptyInputValue)
  const { t } = useTranslation()

  const handleOnChange = useCallback(
    (e, value) => {
      if (!value) {
        return setInputValue(emptyInputValue)
      }
      const appliedItem = JSON.parse(JSON.stringify(value))
      addAppliedItem(appliedItem)
      setInputValue(emptyInputValue)
    },
    [addAppliedItem],
  )

  const handleOnInputChange = useCallback(
    e => {
      const value = e.target.value
      setInputValue(value)
      if (value.length >= AUTOCOMPLETE_MIN_LENGTH) {
        setSearchText(value)
      } else {
        setOpen(false)
      }
    },
    [setOpen, setSearchText],
  )

  const isOptionDisabled = useCallback(
    option => {
      const filter = filterAlreadyApplied(option)
      return !!(alreadyApplied.find(filter) || appliedData.find(filter))
    },
    [alreadyApplied, appliedData],
  )

  const onSearchIconClick = useCallback(() => {
    setSearchText(inputValue)
    setOpen(true)
  }, [inputValue, setOpen, setSearchText])

  const renderInput = useCallback(
    params => (
      <AutocompleteInput
        handleOnInputChange={handleOnInputChange}
        onSearchIconClick={onSearchIconClick}
        loading={loading}
        error={error}
        {...params}
      />
    ),
    [handleOnInputChange, onSearchIconClick, loading, error],
  )

  const onOpen = useCallback(
    event => {
      const inputValue = event.target.value
      if (inputValue.length >= AUTOCOMPLETE_MIN_LENGTH - 1) {
        setOpen(true)
      }
    },
    [setOpen],
  )

  return (
    <Autocomplete
      value={AUTOCOMPLETE_VALUE}
      open={open}
      onOpen={onOpen}
      onClose={toggleOpen}
      loading={loading}
      loadingText={t('common.loading')}
      inputValue={inputValue}
      filterOptions={filterOptions}
      getOptionDisabled={isOptionDisabled}
      options={loading ? EMPTY_ARRAY : data}
      noOptionsText={t('policies.details.appliedDialogNoResults')}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      onChange={handleOnChange}
      renderInput={renderInput}
    />
  )
})

AutocompleteComponent.propTypes = {
  addAppliedItem: PropTypes.func.isRequired,
  setSearchText: PropTypes.func.isRequired,
  context: PropTypes.object,
  appliedData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      info: PropTypes.shape({
        displayName: PropTypes.string,
        primaryEmail: PropTypes.string,
        username: PropTypes.string,
      }),
    }),
  ),
  alreadyApplied: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      info: PropTypes.shape({
        displayName: PropTypes.string,
        primaryEmail: PropTypes.string,
        username: PropTypes.string,
      }),
    }),
  ),
}

AutocompleteComponent.defaultProps = {
  appliedData: [],
  alreadyApplied: [],
}
export default AutocompleteComponent
