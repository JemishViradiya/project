import React, { useCallback } from 'react'

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

import type { BrowserDomain, Template } from '@ues-data/dlp'
import { BasicCancel, BasicSearch } from '@ues/assets'
import { DialogChildren } from '@ues/behaviours'

type Item = Template | BrowserDomain
const useStyles = makeStyles(theme => ({
  content: {
    maxHeight: '60vh',
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  list: {
    marginTop: theme.spacing(2),
    overflowY: 'auto',
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

export type ItemDialogProps = {
  labels: {
    title?: string
    description?: string
    noTemplates?: string
    searchText?: string
    cancel?: string
    submit?: string
  }
  labelFields: { name: string; description?: string }
  variants: Item[]
  renderListItem: (a: unknown) => React.ReactNode
  handleSearchChange: (s: string) => void
  closeHandler: () => void
  submitHandler: (selectedVariants: Item[]) => void
  loading?: boolean
}

export const ItemsDialogContent = ({
  labels,
  variants,
  renderListItem,
  handleSearchChange,
  closeHandler,
  submitHandler,
  loading = false,
  labelFields,
}: ItemDialogProps): JSX.Element => {
  const [checked, setChecked] = React.useState({})
  const [search, setSearch] = React.useState('')
  const classes = useStyles()

  const handleToggle = useCallback(
    (guid: string, value: Item) => () => {
      const currentIndex = checked[guid]
      const newChecked = { ...checked }

      if (currentIndex === undefined) {
        newChecked[guid] = value
      } else {
        delete newChecked[guid]
      }

      setChecked(newChecked)
    },
    [checked],
  )

  const handleSearch = useCallback(
    value => {
      handleSearchChange(value)
      setSearch(value)
    },
    [handleSearchChange],
  )

  const deleteItem = useCallback(
    guid => {
      const newChecked = { ...checked }
      delete newChecked[guid]
      setChecked(newChecked)
    },
    [checked],
  )

  const onSubmit = useCallback(() => {
    submitHandler(Object.values(checked))
  }, [checked, submitHandler])

  return (
    <DialogChildren
      title={labels?.title}
      description={variants.length ? labels?.description : labels?.noTemplates}
      content={
        <Box className={classes.content}>
          <TextField
            label={labels?.searchText}
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
              {Object.values(checked).map((v: Item, index) => (
                <Chip
                  key={`chip-${index}`}
                  size="small"
                  label={v[labelFields.name]}
                  deleteIcon={<CloseIcon />}
                  onDelete={() => deleteItem(v.guid)}
                />
              ))}
            </Box>
          )}

          <List classes={{ root: classes.list }}>
            {variants?.map(value => {
              const labelId = `checkbox-list-label-${value.guid}`
              return (
                <ListItem key={value.guid} button dense onClick={handleToggle(value.guid, value)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked[value.guid] !== undefined}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
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
            {labels?.cancel}
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit} disabled={Object.keys(checked).length === 0}>
            {labels?.submit}
          </Button>
        </>
      }
      onClose={closeHandler}
    />
  )
}
