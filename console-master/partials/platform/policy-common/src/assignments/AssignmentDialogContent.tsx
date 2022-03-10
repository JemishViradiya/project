import React, { useCallback, useEffect, useMemo } from 'react'

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
  makeStyles,
  TextField,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { BasicCancel, BasicSearch } from '@ues/assets'
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
    marginTop: theme.spacing(2),
    overflowY: 'auto',
    flexGrow: 1,
  },
  chosenItems: {
    flexShrink: 0,
    maxHeight: '10vh',
    overflowY: 'auto',
    '& .MuiChip-root': {
      margin: '2px',
    },
  },
  noResultsMessageContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

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
  handleSearchChange: (s: string) => void
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
  const classes = useStyles()

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

  const handleSearch = useCallback(
    value => {
      setSearch(value)
      handleSearchChange(value)
    },
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

  const resetSearch = () => {
    handleSearchChange('')
    setSearch('')
  }

  const onSubmit = useCallback(() => {
    submitHandler(Object.values(checked))
    setSearch('')
  }, [checked, submitHandler])

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

  const listContent = useMemo(() => {
    if (search && !loading && (!variants || variants.length === 0)) {
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
            value={search}
            onChange={e => handleSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <IconButton onClick={() => handleSearch('')}>{search ? <BasicCancel /> : <BasicSearch />}</IconButton>
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
