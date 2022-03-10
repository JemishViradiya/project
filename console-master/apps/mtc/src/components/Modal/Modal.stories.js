import React from 'react'

import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'

import Modal from './Modal'

const stories = storiesOf('Modal', module)

stories.add('simple view', () => (
  <Modal open closeButton>
    <p>Lorem ipsum bopibsum fee fi fo fipsum</p>
  </Modal>
))

stories.add('confirmation modal', () => (
  <Modal open={boolean('Modal Open?', true)} closeButton={boolean('Close Button?', true)}>
    <Modal.Header>You sure?</Modal.Header>
    <Modal.Content>
      <p>Do you not want to not continue?</p>
    </Modal.Content>
    <Modal.Actions
      onCancel={action('Canceled.')}
      onConfirm={action('Confirmed')}
      confirmText={text('Confirm Text', 'Confirm')}
      cancelText={text('Cancel Text', 'Cancel')}
    />
  </Modal>
))

stories.add('warning modal', () => {
  return (
    <Modal open={boolean('Modal Open?', true)} closeButton={boolean('Close Button?', true)}>
      <Modal.Header>Warning</Modal.Header>
      <Modal.Warning
        dangerText={
          <p>
            All information pertaining to <strong>Bilbo Baggins</strong> will be removed. <br />
            This information cannot be restored (unless you ask nicely).
          </p>
        }
      />
      <Modal.VerifyText toMatch="Bilbo Baggins" onChange={action('Text changed')} />
      <Modal.Actions
        onCancel={action('Canceled.')}
        onConfirm={action('Confirmed')}
        confirmText={text('Confirm Text', 'Confirm')}
        cancelText={text('Cancel Text', 'Cancel')}
        confirmDisabled
      />
    </Modal>
  )
})
