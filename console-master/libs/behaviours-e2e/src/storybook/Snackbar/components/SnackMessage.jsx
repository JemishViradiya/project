/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import classnames from 'classnames'
import { SnackbarContent } from 'notistack'
import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CloseIcon from '@material-ui/icons/Close'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { useSnackbar } from '@ues/behaviours'

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '344px !important',
    },
  },
  card: {
    backgroundColor: '#fddc6c',
    width: '100%',
  },
  typography: {
    fontWeight: 'bold',
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
  },
  icons: {
    marginLeft: 'auto',
  },
  expand: {
    padding: '8px 8px',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  collapse: {
    padding: 16,
  },
  checkIcon: {
    fontSize: 20,
    color: '#b3b3b3',
    paddingRight: 4,
  },
  button: {
    padding: 0,
    textTransform: 'none',
  },
}))

const SnackMessage = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const { closeMessage } = useSnackbar()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleDismiss = () => {
    closeMessage(props.id)
  }

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant="subtitle2" className={classes.typography}>
            {props.messageText}
          </Typography>
          <div className={classes.icons}>
            <IconButton
              aria-label="Show more"
              className={classnames(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton className={classes.expand} onClick={handleDismiss}>
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper className={classes.collapse}>
            <Typography gutterBottom>PDF ready</Typography>
            <Button size="small" className={classes.button}>
              <CheckCircleIcon className={classes.checkIcon} />
              Download now
            </Button>
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  )
})

export default SnackMessage
