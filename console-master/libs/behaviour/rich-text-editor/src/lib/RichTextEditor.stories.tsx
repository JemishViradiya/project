import React from 'react'
import { useForm } from 'react-hook-form'

import { makeStyles } from '@material-ui/core'

import { SnackbarProvider, useSnackbar } from '@ues/behaviours'

import RichTextEditor from './RichTextEditor'
import markdown from './RichTextEditor.md'
import { StartStateType } from './RichTextEditorTypes'

const useStyles = makeStyles(theme => ({
  '@global': {
    ':focus': {
      outline: 'none',
    },
  },
  root: { display: 'flex', flexFlow: 'column nowrap' },
}))

const startEditorState = `
Hello <strong>There</strong>

This is a sample editor with React Quill
`
type FormData = {
  email: string
}

const SnackBarWrappedRichTextEditor = props => {
  const Standard = props => {
    const { enqueueMessage } = useSnackbar()
    const classes = useStyles()
    const { register } = useForm<FormData>({
      mode: 'onBlur',
    })
    const handleError = lErrorMsg => {
      enqueueMessage(lErrorMsg, 'error')
    }
    return (
      <div className={classes.root}>
        This is an example of rich text editor whose value is {props.required ? 'required' : 'optional'}.
        <br />
        <br />
        {props.readOnly
          ? 'It is not editable as in the case  the logged in user *does not have* permission to update (example !hasPermission(Permission.XYZ_UPDATE)).'
          : 'It is editable as in the case the logged in user *has* permission to update (example hasPermission(Permission.XYZ_UPDATE)).'}
        <RichTextEditor
          fieldLabel={props.required ? 'Some Required Label*' : 'Some Label'}
          fieldName="email"
          startEditorStateType={StartStateType.HTML}
          startEditorState={startEditorState}
          readOnly={props.readOnly}
          register={register}
          required={props.required}
          onError={handleError}
        />
      </div>
    )
  }

  return (
    <SnackbarProvider>
      <Standard {...props} />
    </SnackbarProvider>
  )
}

export const Editor = storyBookArgs => {
  return (
    <SnackBarWrappedRichTextEditor
      required={storyBookArgs.required}
      readOnly={storyBookArgs.readOnly}
    ></SnackBarWrappedRichTextEditor>
  )
}

export default {
  title: 'Rich Text Editor',
  parameters: {
    notes: markdown,
  },
  argTypes: {
    required: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
      description: 'Specify if the editor is required.',
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      description:
        'Specify if the editor is in read-only mode as in the case when logged in user does not have permission to update.',
    },
  },
}
