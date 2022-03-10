/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core'

import { BasicCancel, BasicSearch, defaultChipProps, useInputFormControlStyles } from '@ues/assets'
import { DialogChildren } from '@ues/behaviours'

const useStyles = makeStyles(theme => ({
  content: {
    minHeight: '60vh',
    maxHeight: '60vh',
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  list: {
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(4),
    overflowY: 'auto',
    flexGrow: 1,
    '& .MuiListItem-button': {
      '&:hover': {
        backgroundColor: theme.palette.logicalGrey[100],
      },
    },
    '& .Mui-selected': {
      backgroundColor: theme.props.colors.secondary[50],
    },
  },
  chosenItems: {
    flexShrink: 0,
    maxHeight: '10vh',
    overflowY: 'auto',
    '& .MuiChip-root': {
      margin: '2px',
    },
  },
}))

export const SearchDialog = props => {
  const {
    open,
    setOpen,
    labels,
    values,
    renderListItem,
    handleSearchChange,
    closeHandler,
    submitHandler,
    loading,
    policyType,
    rankable,
  } = props
  const [checked, setChecked] = React.useState({})
  const [search, setSearch] = React.useState('')
  const classes = useStyles()
  const { iconButton } = useInputFormControlStyles()
  const { t } = useTranslation(['platform/common'])

  useEffect(() => {
    setChecked({})
    setSearch('')
  }, [open])

  const handleToggle = useCallback(
    (id, value) => () => {
      if (rankable) {
        const newChecked = { [id]: value }
        setChecked(newChecked)
      } else {
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
      }
    },
    [checked, rankable],
  )

  const handleSearch = useCallback(
    value => {
      handleSearchChange(value, policyType)
      setSearch(value)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSearchChange],
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
  }, [checked, submitHandler])

  const onClose = () => setOpen(false)

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
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
              value={search}
              onChange={e => handleSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <IconButton classes={{ root: iconButton }} onClick={() => handleSearch('')}>
                        {search ? <BasicCancel /> : <BasicSearch />}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />

            {Object.values(checked).length > 0 && (
              <Box className={classes.chosenItems} role="group" aria-label={t('chosenItems')}>
                {Object.values(checked).map((v, index) => (
                  <Chip
                    key={`chip-${index}`}
                    variant="outlined"
                    size="small"
                    label={v.name}
                    onDelete={() => deleteItem(v.id)}
                    {...defaultChipProps}
                  />
                ))}
              </Box>
            )}

            <List classes={{ root: classes.list }} role="listbox">
              {values.map(value => {
                const labelId = `checkbox-list-label-${value.id}`

                return (
                  <ListItem
                    key={value.id}
                    selected={checked[value.id] !== undefined || (value.disabled ?? false)}
                    button
                    dense
                    disabled={value.disabled ?? false}
                    onClick={handleToggle(value.id, value)}
                  >
                    {!rankable ? (
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked[value.id] !== undefined || (value.disabled ?? false)}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                    ) : null}
                    <ListItemText id={labelId}>{renderListItem(value)}</ListItemText>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        }
        actions={
          <>
            <Button variant="outlined" onClick={closeHandler}>
              {labels.cancel}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onSubmit(checked)}
              disabled={Object.keys(checked).length === 0}
            >
              {labels.submit}
            </Button>
          </>
        }
        onClose={onClose}
      />
    </Dialog>
  )
}
