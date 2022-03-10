import React, { useState } from 'react'

import { Button, Chip, Grid, List, Popover } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import { dropdownMenuProps } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

import { INFO_TYPES } from '../../model/Template'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    width: theme.spacing(50),
    maxWidth: theme.spacing(50),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

const SearchByInformationType = ({ setChosenInformationTypes }) => {
  const classes = useStyles()
  const [infoTypes, setInfoTypes] = useState(Object.keys(INFO_TYPES).map(infoType => ({ key: infoType, checked: false })))
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const handleInfoTypeChosen = infoType => {
    let updatedInfoTypes = infoTypes.map(type => {
      if (type.key === infoType.key) {
        return {
          ...type,
          checked: !type.checked,
        }
      }
      return type
    })
    setInfoTypes(updatedInfoTypes)
  }

  const onInfoTypeSave = event => {
    const inTypeKeys = infoTypes?.filter(infoType => infoType.checked).map(infoType => infoType.key)
    setChosenInformationTypes(inTypeKeys)
    handlePopoverClose(event)
  }

  const onClearAll = () => {
    setInfoTypes(Object.keys(INFO_TYPES).map(infoType => ({ key: infoType, checked: false })))
  }
  return (
    <>
      {infoTypes.every(infoType => {
        return !infoType.checked
      }) ? (
        <Tooltip title="InformationType">
          <Chip label="InformationType" variant="outlined" onClick={handlePopoverClick} />
        </Tooltip>
      ) : (
        infoTypes
          .filter(infoType => infoType.checked)
          .map(infoType => (
            <Tooltip key={infoType.key} title="InformationType">
              <Chip label={INFO_TYPES[infoType.key]} variant="outlined" color="primary" onClick={handlePopoverClick} />
            </Tooltip>
          ))
      )}

      <Popover
        open={popoverIsOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        {...dropdownMenuProps}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.paper,
        }}
      >
        <Grid container className={classes.container}>
          <Grid item xs={12}>
            <List>
              <Grid container justify="space-between">
                {infoTypes.map((infoType, i) => (
                  <Grid key={infoType.key} item xs={6}>
                    <ListItem key={infoType + i} button dense onClick={() => handleInfoTypeChosen(infoType)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={infoType.checked} tabIndex={-1} inputProps={{ 'aria-labelledby': i }} />
                      </ListItemIcon>
                      <ListItemText id={infoType} primary={INFO_TYPES[infoType.key]} />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
          </Grid>
          <Divider width="100%" className={classes.divider} />
          <Grid item xs={12}>
            <Grid container justify="space-between">
              <Grid item xs={3}>
                <Button onClick={onClearAll}>Clear all</Button>
              </Grid>
              <Grid item xs={3}>
                <Button color="primary" onClick={onInfoTypeSave}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </>
  )
}

export default SearchByInformationType
