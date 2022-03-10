import React from 'react'

import { Button } from '@material-ui/core'

import { FormButtonPanel } from '@ues/behaviours'

const FormButtonStory = ({ showPanel, showSaveAs, ...args }) => {
  return (
    <FormButtonPanel show={showPanel}>
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained" color="primary">
        Save
      </Button>
      {showSaveAs && (
        <Button variant="contained" color="primary">
          Save as
        </Button>
      )}
    </FormButtonPanel>
  )
}

export const FormButton = FormButtonStory.bind({})

FormButton.args = {
  showPanel: true,
  showSaveAs: true,
}

export default {
  title: 'Layout/Page elements/Form buttons',
  component: FormButtonStory,
  argTypes: {
    showPanel: {
      control: { type: 'boolean' },
      description: 'Show panel.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
    showSaveAs: {
      control: { type: 'boolean' },
      description: 'Show saveAs button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
      },
    },
  },
}
