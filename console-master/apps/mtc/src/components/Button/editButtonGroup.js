import React from 'react'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import CreateIcon from '@material-ui/icons/Create'

const useStyles = makeStyles({
  buttonGroup: {
    float: 'right',
  },
  createButton: {
    border: 'none',
    'border-radius': '0px',
    padding: '8px',
    '&:hover': {
      background: 'none',
    },
  },
  iconButton: {
    'border-radius': '0px',
    border: '1px solid black',
    padding: '8px',
  },
  icon: {
    'font-size': '1.25rem',
  },
})

const EditButtonGroup = ({ onCancel, onSave, onEdit, edit }) => {
  const classes = useStyles()
  return (
    <div>
      {edit === false && (
        <ButtonGroup
          classes={{
            root: classes.buttonGroup,
          }}
          disableRipple
          aria-label="outlined primary button group"
        >
          <IconButton
            id="icon-pencil"
            aria-label="check"
            classes={{
              root: classes.createButton,
            }}
            onClick={onEdit}
          >
            <CreateIcon />
          </IconButton>
        </ButtonGroup>
      )}
      {edit && (
        <ButtonGroup
          classes={{
            root: classes.buttonGroup,
          }}
          disableRipple
          aria-label="outlined primary button group"
        >
          <IconButton
            id="icon-checkmark"
            aria-label="check"
            classes={{
              root: classes.iconButton,
            }}
            onClick={onSave}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            id="icon-times"
            aria-label="cancel"
            classes={{
              root: classes.iconButton,
            }}
            onClick={onCancel}
          >
            <ClearIcon
              classes={{
                root: classes.icon,
              }}
            />
          </IconButton>
        </ButtonGroup>
      )}
    </div>
  )
}

export default EditButtonGroup
