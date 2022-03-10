import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'

import Button from '../Button/index'

require('./appSecretModal.scss')

export const AppSecretModal = props => {
  return (
    <div>
      <Dialog scroll="paper" open={props.open} onClose={props.onClose} disableBackdropClick id="secret-modal">
        <DialogTitle disableTypography>
          <Typography variant="subtitle1">{props.title}</Typography>
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <div>
              <p>
                Use the following credentials to grant API access to the{' '}
                <span className="application-title">{props.applicationName}</span>
              </p>
              <div className="id-secret-container">
                <div>
                  <div className="id-secret-title">Application ID</div>
                  <div className="id-secret-content">
                    <div className="id-secret">
                      <p>{props.appId}</p>
                    </div>
                    <div>
                      <CopyToClipboard text={props.appId}>
                        <Button>Copy</Button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="id-secret-title">Application Secret</div>
                  <div className="id-secret-content">
                    <div className="id-secret">
                      <p>{props.secret}</p>
                    </div>
                    <div>
                      <CopyToClipboard text={props.secret}>
                        <Button>Copy</Button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={props.onSubmit} color="primary" id="ok">
            {props.submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default {
  title: 'Modal/Dialog',
}
