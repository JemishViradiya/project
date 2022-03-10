import * as httpStatus from 'http-status-codes'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import type { GroupResponse } from '@ues-data/emm'
import { ConnectionApi, ServerAddConnectionAppConfigSubStatusCode } from '@ues-data/emm'
import { useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicCancel, BasicSearch } from '@ues/assets'
import { DialogChildren, useSnackbar } from '@ues/behaviours'

import { parseJson } from '../common/Util'
import makeStyles from './AddConnectionAppConfigStyle'

export type AssignmentItem = {
  id: string
  displayName: string
  disabled: boolean
}

export type AssignmentDialogProps = {
  labels: {
    title?: string
    description?: string
    searchText?: string
    cancel?: string
    submit?: string
    noSearchResultsText?: string
  }
  variants: AssignmentItem[]
  renderListItem: (a: unknown) => React.ReactNode
  handleSearchChange: (searchResponse: GroupResponse) => void
  closeHandler: () => void
  submitHandler: (selectedVariants: AssignmentItem[]) => void
  loading?: boolean
}

export const AssignmentDialogContent = ({
  labels,
  variants,
  renderListItem,
  handleSearchChange,
  closeHandler,
  submitHandler,
  loading = false,
}: AssignmentDialogProps): JSX.Element => {
  const [checked, setChecked] = React.useState({})
  const [search, setSearch] = React.useState('')
  const [tempQuery, setTempQuery] = React.useState('')
  const [typingTimeout, setTypingTimeout] = React.useState(undefined)
  const classes = makeStyles()
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(['emm/connection'])

  const { data: searchResponse, error: searchError } = useStatefulAsyncQuery(ConnectionApi.queryGroupsAsync, {
    variables: { emmType: 'Intune', searchQuery: search },
  })

  useEffect(() => {
    if (searchResponse) {
      handleSearchChange(searchResponse as GroupResponse)
    }
  }, [handleSearchChange, searchResponse])

  useEffect(() => {
    if (searchError) {
      const loadGroupError = 'emm.appConfig.error.loadGroup'
      const response = searchError['response']
      if (response) {
        if (
          response.status === httpStatus.BAD_REQUEST &&
          ServerAddConnectionAppConfigSubStatusCode.includes(response.data.subStatusCode)
        ) {
          enqueueMessage(t('server.error.intune.addAppConfig.' + response.data.subStatusCode), 'error')
        } else {
          let message = response.data.message
          if (message) {
            message = parseJson(message)
            if (message && message.subStatusCode === httpStatus.BAD_REQUEST) {
              const error = t('emm.appConfig.error.loadGroupInvalidQuery', {
                searchQuery: search,
              })
              enqueueMessage(error, 'error')
            } else {
              enqueueMessage(t(loadGroupError), 'error')
            }
          } else {
            console.error('Error response - ', response)
            enqueueMessage(t(loadGroupError), 'error')
          }
        }
      } else {
        console.error('Group search issue - ', searchError)
        enqueueMessage(t(loadGroupError), 'error')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueMessage, searchError, t])

  const handleToggle = useCallback(
    (id: string, value: AssignmentItem) => () => {
      if (!value.disabled) {
        const currentIndex = checked[id]
        const newChecked = { ...checked }

        if (currentIndex === undefined) {
          newChecked[id] = value
        } else {
          delete newChecked[id]
        }

        setChecked(newChecked)
      }
    },
    [checked],
  )

  const deleteItem = useCallback(
    id => {
      const newChecked = { ...checked }
      delete newChecked[id]
      setChecked(newChecked)
    },
    [checked],
  )

  const onSubmit = useCallback(() => {
    submitHandler(Object.values(checked))
    setSearch('')
  }, [checked, submitHandler])

  const resetSearch = () => {
    setSearch('')
    setTempQuery('')
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
  }

  const handleClose = useCallback(() => {
    resetSearch()
    closeHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      resetSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    setTypingTimeout(
      setTimeout(function () {
        setSearch(tempQuery)
      }, 1000),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempQuery])

  const listContent = useMemo(() => {
    if (search && !loading && variants?.length === 0) {
      return <div className={classes.noResultsMessageContainer}>{labels.noSearchResultsText}</div>
    }

    return variants.map(value => {
      const labelId = `checkbox-list-label-${value.id}`

      return (
        <ListItem key={value.id} button dense disabled={value.disabled ?? false} onClick={handleToggle(value.id, value)}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked[value.id] !== undefined || (value.disabled ?? false)}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText id={labelId}>{renderListItem(value)}</ListItemText>
        </ListItem>
      )
    })
  }, [search, variants, loading, renderListItem, checked, handleToggle, labels, classes])

  return (
    <DialogChildren
      title={labels.title}
      description={labels.description}
      content={
        <Box className={classes.content}>
          <TextField
            label={labels.searchText}
            id="standard-start-adornment"
            variant="filled"
            fullWidth
            value={tempQuery}
            onChange={e => setTempQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <IconButton onClick={() => resetSearch()}>{search ? <BasicCancel /> : <BasicSearch />}</IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />

          {Object.values(checked).length > 0 && (
            <Box className={classes.chosenItems}>
              {Object.values(checked).map((v: AssignmentItem, index) => (
                <Chip
                  key={`chip-${index}`}
                  size="small"
                  label={v.displayName}
                  deleteIcon={<CloseIcon />}
                  onDelete={() => deleteItem(v.id)}
                />
              ))}
            </Box>
          )}

          <List classes={{ root: classes.list }}>{listContent}</List>
        </Box>
      }
      actions={
        <>
          <Button variant="outlined" onClick={handleClose}>
            {labels.cancel}
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit} disabled={Object.keys(checked).length === 0}>
            {labels.submit}
          </Button>
        </>
      }
      onClose={handleClose}
    />
  )
}
