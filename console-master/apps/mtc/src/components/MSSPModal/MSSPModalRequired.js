import React from 'react'
import { Dimmer, Loader, Modal } from 'semantic-ui-react'

import Button from '../Button'

require('./MSSPModal.scss')

const MSSPModalRequired = props => (
  <div>
    <Modal open={props.modalOpen} dimmer="blurring" id={props.id} className="mssp-modal">
      <Modal.Header>
        <h3>{props.header}</h3>
        <span className="icon-times" onClick={props.cancelModal} />
      </Modal.Header>
      <Modal.Content>
        <Dimmer active={props.modalLoading} inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
        {props.children}
      </Modal.Content>
      <Modal.Actions>
        <Button outlined id={`${props.id}-cancel-button`} className="cancel" onClick={props.cancelModal}>
          {props.cancelText}
        </Button>
        <Button
          id={`${props.id}-confirm-button`}
          className={`confirm ${props.containsErrors() ? ' selectable' : ' not-selectable'}`}
          onClick={props.confirmModal}
        >
          {props.confirmText}
        </Button>
      </Modal.Actions>
    </Modal>
  </div>
)

export default MSSPModalRequired
