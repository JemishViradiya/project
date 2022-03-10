import React, { useCallback, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { action } from '@storybook/addon-actions'

import type { DialogProps } from '@material-ui/core'
import {
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select as MuiSelect,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'

import { makeCheckboxHelperTextStyles, useDefaultFormControlStyles, useInputFormControlStyles } from '@ues/assets'
import type { UseControlledDialogProps } from '@ues/behaviours'
import {
  ConfirmationDialog as ConfirmationDialogComponent,
  DialogChildren,
  FileUpload as FileUploadComponent,
  useControlledDialog,
  useDialogPrompt,
} from '@ues/behaviours'

import { randomString, reallyLongString } from '../utils'

const logSubmit = action('submitSuccess')
const logClose = action('onClose')

const submitFormApi = data => new Promise(resolve => setTimeout(resolve, 600, { result: 'mock', data }))

const items = [
  { id: Symbol(1), name: 'Test 1' },
  { id: Symbol(2), name: 'Test 2' },
  { id: Symbol(3), name: 'Test 3' },
]

export const SampleDialogSizes = () => {
  const classes = makeStyles(theme => ({
    root: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
  }))()
  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm')
  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      logClose(reason)
      setDialogStateId(undefined)
    }, []),
  })

  const handleOpenDialog = (maxWidth: DialogProps['maxWidth']) => {
    setMaxWidth(maxWidth)
    setDialogStateId(Symbol(`dialog-${maxWidth}`))
  }

  return (
    <>
      <Button classes={classes} variant="outlined" onClick={() => handleOpenDialog('xs')}>
        Open extra small dialog
      </Button>
      <Button classes={classes} variant="outlined" onClick={() => handleOpenDialog('sm')}>
        Open small dialog
      </Button>
      <Button classes={classes} variant="outlined" onClick={() => handleOpenDialog('md')}>
        Open medium dialog
      </Button>
      <Button classes={classes} variant="outlined" onClick={() => handleOpenDialog('lg')}>
        Open large dialog
      </Button>
      <Button classes={classes} variant="outlined" onClick={() => handleOpenDialog('xl')}>
        Open extra large dialog
      </Button>

      <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
        <DialogChildren
          title="Sample dialog"
          description="This is a sample dialog description"
          onClose={onClose}
          content={
            <div>
              <Typography variant="body2">{reallyLongString}</Typography>
              <Typography variant="body2">{reallyLongString}</Typography>
              <Typography variant="body2">{reallyLongString}</Typography>
            </div>
          }
          actions={
            <>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" onClick={onClose}>
                Submit
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  )
}

export const Form = () => {
  const classes = makeStyles(theme => ({
    textField: {
      flexGrow: 1,
    },
  }))()

  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()

  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      logClose(reason)
      setDialogStateId(undefined)
    }, []),
  })

  const formProps = {
    component: 'form' as React.ElementType<React.HTMLAttributes<HTMLElement>>,
    onSubmit: useCallback(
      event => {
        event.preventDefault()
        event.stopPropagation()
        const formData = [...event.target.elements].reduce(
          (agg, item) => (item.name ? Object.assign(agg, { [item.name]: item.value }) : agg),
          {},
        )
        ;(async () => {
          try {
            const payload = await submitFormApi(formData)
            // handle success
            logSubmit(payload)
            onClose(event)
          } catch (error) {
            // handle error
          }
        })()
      },
      [onClose],
    ),
  }

  return (
    <>
      <table>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>

        {items.map(item => (
          <tr>
            <td>{item.name}</td>
            <td>
              <Button variant="outlined" onClick={() => setDialogStateId(item.id)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </table>

      <Dialog PaperProps={formProps} open={open} onClose={onClose} maxWidth={'xs'} fullWidth>
        <DialogChildren
          title={'Add user'}
          content={<TextField className={classes.textField} name="name" label="User name" size="small" />}
          onClose={onClose}
          actions={
            <>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" onClick={onClose}>
                Submit
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  )
}

export const Layout = () => {
  const classes = makeStyles(theme => ({
    maxWidthField: {
      flexGrow: 1,
    },
    numericField: {
      '&.MuiInputBase-root': {
        width: '200px',
      },
    },
  }))()

  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()

  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      logClose(reason)
      setDialogStateId(undefined)
    }, []),
  })

  const CheckboxGroup = () => {
    const theme = useTheme()
    const helperTextClasses = makeStyles({ ...makeCheckboxHelperTextStyles(theme, 'small') })()

    return (
      <FormControl
        component="fieldset"
        color="secondary"
        //className={classes.formControl}
      >
        <FormLabel>Checkbox group</FormLabel>
        <FormGroup>
          <FormControl>
            <FormControlLabel
              control={<Checkbox size="small" color="secondary" name="checkbox1" defaultChecked key="1" />}
              label={<Typography variant="body2">'Checkbox 1'</Typography>}
              id="checkbox1"
            />
            <FormHelperText classes={helperTextClasses}>{randomString()}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={<Checkbox size="small" color="secondary" name="checkbox2" key="2" />}
              label={<Typography variant="body2">'Checkbox 2'</Typography>}
              id="checkbox2"
            />
            <FormHelperText classes={helperTextClasses}>{randomString()}</FormHelperText>
          </FormControl>
        </FormGroup>
      </FormControl>
    )
  }

  const SelectComponent = () => {
    const theme = useTheme()
    const classes = useDefaultFormControlStyles(theme)
    const [value, setValue] = React.useState('')
    const handleChange = event => {
      setValue(event.target.value)
    }

    return (
      <FormControl variant="filled" size="small" color="secondary" classes={classes}>
        <InputLabel id="simple-select-outlined-label">Select</InputLabel>
        <MuiSelect
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          label="Select"
          value={value}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>Item 1</MenuItem>
          <MenuItem value={2}>Item 2</MenuItem>
          <MenuItem value={3}>Item 3</MenuItem>
        </MuiSelect>
        <FormHelperText>{randomString()}</FormHelperText>
      </FormControl>
    )
  }

  const DialogContent = () => {
    const theme = useTheme()
    const inputFormControlStyles = useInputFormControlStyles(theme)
    return (
      <Grid container direction="column" spacing={4}>
        <TextField classes={inputFormControlStyles} name="textValue1" label="Text value" size="small" />
        <SelectComponent />
        <CheckboxGroup />
        <TextField
          type="number"
          name="number1"
          classes={inputFormControlStyles}
          label="Numeric value"
          size="small"
          InputProps={{ classes: { root: classes.numericField } }}
          helperText={reallyLongString}
        />
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <FileUploadComponent onSelectFiles={() => {}} />
      </Grid>
    )
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setDialogStateId(Symbol('form-layout-dialog'))}>
        Open dialog
      </Button>
      <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
        <DialogChildren
          title={'Add a new entry'}
          content={<DialogContent />}
          onClose={onClose}
          actions={
            <>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" onClick={onClose}>
                Submit
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  )
}

export const Confirmation = () => {
  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()

  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      logClose(reason)
      setDialogStateId(undefined)
    }, []),
  })

  return (
    <>
      <Button variant="outlined" onClick={() => setDialogStateId(Symbol('confirmation-dialog'))}>
        Open confirmation dialog
      </Button>
      <ConfirmationDialogComponent
        open={open}
        title="Confirmation dialog title"
        description={randomString()}
        content={reallyLongString}
        cancelButtonLabel="Cancel"
        confirmButtonLabel="Submit"
        onConfirm={() => {
          /* confirm action */
          setDialogStateId(undefined)
        }}
        onCancel={onClose}
      />
    </>
  )
}

export const FileUpload = () => {
  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>()
  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      logClose(reason)
      setDialogStateId(undefined)
    }, []),
  })

  const handleSelectFiles = (files: Array<File>) => {
    setSelectedFiles(files)
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setDialogStateId(Symbol('file-upload'))}>
        Open file upload dialog
      </Button>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
        <DialogChildren
          title="File upload dialog"
          description="Select a file to upload."
          onClose={onClose}
          content={<FileUploadComponent onSelectFiles={handleSelectFiles} />}
          actions={
            <>
              <Button variant="outlined" size="medium" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" onClick={onClose}>
                Submit
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  )
}

export const UnsavedChanges = () => {
  const navigate = useNavigate()
  const changesSaved = false

  const handleNavigateForward = useCallback(() => {
    navigate('/somewhere-else')
  }, [navigate])

  const UnsavedConfirmationDialogComponent = () => {
    return useDialogPrompt('Do you want to leave this page? Your changes have not been saved.', !changesSaved)
  }

  const UnsavedConfirmationDialog = useCallback(UnsavedConfirmationDialogComponent, [changesSaved])

  return (
    <>
      <Button variant="outlined" onClick={handleNavigateForward}>
        Open unsaved confirmation dialog
      </Button>
      <UnsavedConfirmationDialog />
    </>
  )
}

const SomewhereElse = () => {
  const navigate = useNavigate()
  const goBack = useCallback(() => navigate(-1), [navigate])
  return (
    <>
      <h2>Somewhere Else</h2>
      <Button onClick={goBack} variant="outlined">
        Go Back
      </Button>
    </>
  )
}

const StoryRoutes = (story, ctx) => {
  const El = () => story(ctx)
  return (
    <Routes>
      <Route path="/somewhere-else" element={<SomewhereElse />} />
      <Route path="/" element={<El />} />
    </Routes>
  )
}

UnsavedChanges.decorators = [StoryRoutes]

export default {
  title: 'Dialogs',
}
