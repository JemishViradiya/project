import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import { BasicClose } from '@ues/assets'

import markdown from './Dialog.md'

export default {
  title: 'Modal',
  parameters: { notes: markdown, 'in-dsm': { id: '5f8ef7994d7a1164af3efa9f' } },
}

export const dialog = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, toggleOpen] = useState(false)

  const handleClick = () => {
    toggleOpen(!open)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Open dialog
      </Button>
      <Dialog scroll="paper" open={open} onClose={handleClick} disableBackdropClick>
        <DialogTitle disableTypography>
          <Typography variant="h2">Modal Title</Typography>
          <IconButton size="small" onClick={handleClick}>
            <BasicClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
            risus, porta ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum
            faucibus dolor auctor.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec
            sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec
            sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec
            sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClick}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export const alert = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, toggleOpen] = useState(false)

  const handleClick = () => {
    toggleOpen(!open)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Open alert / confirmation
      </Button>
      <Dialog scroll="paper" open={open} onClose={handleClick} disableBackdropClick>
        <DialogContent>
          <Typography variant="body2">
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
            risus, porta ac consectetur ac, vestibulum at eros.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClick}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClick} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
