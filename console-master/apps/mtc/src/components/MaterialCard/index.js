import React from 'react'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import CreateIcon from '@material-ui/icons/Create'

const useStyles = makeStyles({
  root: {
    overflow: 'inherit',
  },
  paper: {
    'margin-bottom': '24px',
  },
  cardcontent: {
    '&:last-child': {
      paddingBottom: '24px',
    },
  },
  fullHeight: {
    height: '100%',
  },
  filled: {
    background: 'red',
  },
  buttonGroup: {
    float: 'right',
    margin: '15px 15px 0 0',
  },
  createButton: {
    border: 'none',
    'border-radius': '0px',
    padding: '8px',
    '&:hover': {
      background: 'none',
    },
  },
  icon: {
    'font-size': '1.25rem',
  },
})

const MaterialCard = ({ id, children, fullHeight, onCancel, onSave, onEdit, edit, editPermission }) => {
  const classes = useStyles()
  const maxHeight = fullHeight ? 'fullHeight' : ''
  return (
    <Paper
      data-autoid={`card-${id}`}
      elevation={0}
      classes={{
        root: classes.fullHeight,
      }}
      className={classes.paper}
      maxHeight={maxHeight}
    >
      {editPermission && edit === false && (
        <ButtonGroup
          classes={{
            root: classes.buttonGroup,
          }}
          disableRipple
          aria-label="outlined button group"
        >
          <IconButton
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
          aria-label="outlined button group"
        >
          <IconButton
            aria-label="check"
            classes={{
              root: classes.iconButton,
            }}
            onClick={onSave}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
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
      <Card className={classes.root}>
        <CardContent className={classes.cardcontent}>
          <Typography>{children}</Typography>
        </CardContent>
      </Card>
    </Paper>
  )
}

export default MaterialCard
