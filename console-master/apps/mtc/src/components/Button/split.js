import React, { useRef, useState } from 'react'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { makeStyles } from '@material-ui/core/styles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import Button from './'

require('./split.scss')

const useStyles = makeStyles({
  button: {
    'border-right': '1px solid transparent',
  },
})

const SplitButton = ({ options, optionDropdown, onClick, totalCount, tenantCheck }) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const classes = useStyles()

  const handleMenuItemClick = (_, index) => {
    onClick(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  return (
    <div className={`split-button ${totalCount > 0 ? ' selectable' : ' not-selectable'}`}>
      <ButtonGroup ref={anchorRef}>
        <Button onClick={() => onClick(0)} className={classes.button}>
          {options} ({totalCount})
        </Button>
        <Button className={`right-button ${tenantCheck}`} onClick={handleToggle}>
          <ArrowDropDownIcon fontSize="default" />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal placement="bottom-end">
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {optionDropdown.map((option, index) => (
                    <MenuItem key={option} onClick={event => handleMenuItemClick(event, index + 1)}>
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default SplitButton
