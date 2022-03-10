import React from 'react'
import { Modal } from 'semantic-ui-react'

import history from '../../configureHistory'
import Button from '../Button'

require('./SaveModal.scss')

const SaveModal = props => {
  return (
    <div id="save-modal" className="mssp-modal">
      <Modal open={props.open} dimmer="blurring">
        <Modal.Header>
          <h3>It looks like you&rsquo;ve got unsaved changes</h3>
        </Modal.Header>
        <Modal.Content>
          <p>Leaving now means unsaved changes will be lost.</p>
          <p>Are you sure you still want to leave?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button outlined className="cancel-button" id="no-dont-leave" onClick={props.handleClose}>
            No, Dont Leave
          </Button>
          <Button id="leave-without-saving" onClick={history.goBack}>
            Leave Without Saving
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}
export default SaveModal
