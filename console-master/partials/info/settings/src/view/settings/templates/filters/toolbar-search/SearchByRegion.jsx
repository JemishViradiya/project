import React, { useState } from 'react'

import { Button, Chip, Grid, Popover } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import { dropdownMenuProps } from '@ues/assets'
import { usePopover } from '@ues/behaviours'

import { REGION } from '../../model/Template'

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

const SearchByRegion = ({ setChosenRegions }) => {
  const classes = useStyles()
  const [regions, setRegions] = useState(Object.keys(REGION).map(region => ({ key: region, checked: false })))
  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const onRegionChoose = region => {
    let updatedRegions = regions.map(reg => {
      if (reg.key === region.key) {
        return {
          ...reg,
          checked: !reg.checked,
        }
      }
      return reg
    })

    setRegions(updatedRegions)
  }

  const onRegionSave = event => {
    const regionKeys = regions?.filter(region => region.checked).map(region => region.key)
    setChosenRegions(regionKeys)
    handlePopoverClose(event)
  }

  const onClearAll = event => {
    setRegions(Object.keys(REGION).map(region => ({ key: region, checked: false })))
  }

  return (
    <>
      {regions.every(region => {
        return !region.checked
      }) ? (
        <Tooltip title="Region">
          <Chip label="Region" variant="outlined" onClick={handlePopoverClick} />
        </Tooltip>
      ) : (
        regions
          .filter(region => region.checked)
          .map(region => (
            <Tooltip key={region.key} title="Region">
              <Chip label={REGION[region.key]} variant="outlined" color="primary" onClick={handlePopoverClick} />
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
              <Grid key={regions} container justify="space-between">
                {regions.map((region, i) => (
                  <Grid key={region.key} item xs={6}>
                    <ListItem key={region.key + i} button dense onClick={() => onRegionChoose(region)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={region.checked} tabIndex={-1} inputProps={{ 'aria-labelledby': i }} />
                      </ListItemIcon>
                      <ListItemText id={region} primary={REGION[region.key]} />
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
                <Button color="primary" onClick={onRegionSave}>
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

export default SearchByRegion
