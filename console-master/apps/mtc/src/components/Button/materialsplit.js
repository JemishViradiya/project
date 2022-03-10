import React from 'react'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { makeStyles } from '@material-ui/core/styles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles({
  cssRoot: {
    'font-size': '14px',
    'font-weight': '600',
    'font-family': 'Titillium Web,sans-serif',
    'background-color': '#03A5EF',
    'border-radius': '0',
    color: '#fff',
    '&:hover': {
      'background-color': '#1770A6',
      border: '1px solid #1770A6',
      padding: '6px 15px',
    },
    padding: '6px 15px',
    height: '40px',
    '&:disabled': {
      'border-color': 'rgba(0, 0, 0, 0.26)',
      'background-color': 'rgba(0, 0, 0, 0.08)',
    },
    width: 'max-content',
    disabled: {
      'background-color': '#eeeeee',
    },
  },
  outlined: {
    'background-color': '#fff',
    color: '#03A5EF',
    'border-color': '#03A5EF',
    '&:hover': {
      'background-color': 'rgba(3,165,239,0.08)',
    },
  },
  group: {
    'box-shadow': 'none',
    'margin-right': '16px',
  },
})

export default function MaterialSplitButton(props) {
  const { options, optionDropdown, onClick, disableDropdown } = props
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleMenuItemClick = (event, index) => {
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

  const classes = useStyles()

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          ref={anchorRef}
          aria-label="split button"
          disabled={props.totalCount < 1}
          classes={{
            root: classes.group,
            contained: classes.spaced,
          }}
        >
          <Button
            onClick={() => onClick(0)}
            color="primary"
            classes={{
              root: classes.cssRoot,
              outlined: classes.outlined,
            }}
          >
            {options} ({props.totalCount})
          </Button>
          <Button
            size="small"
            color="primary"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
            disabled={disableDropdown}
            classes={{
              root: classes.cssRoot,
              outlined: classes.outlined,
            }}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList variant="menu" id="split-button-menu">
                    {optionDropdown.map((option, index) => (
                      <MenuItem key={option} onClick={event => handleMenuItemClick(event, index)}>
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  )
}
