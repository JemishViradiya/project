import type { SyntheticEvent } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, makeStyles, TextField } from '@material-ui/core'

export interface FileUploadProps {
  onSelectFiles: (fileList: Array<File>) => void
  acceptedFiles?: string // TODO remove it after completion - JIRA ticket is https://jirasd.rim.net/browse/UES-2992
}

const FileUpload = (props: FileUploadProps) => {
  const { onSelectFiles, acceptedFiles } = props
  const [files, setFiles] = useState([])
  const { t } = useTranslation(['components'])

  const selectFiles = (event: SyntheticEvent<HTMLInputElement>) => {
    const element: HTMLInputElement = event.currentTarget
    const selectedFiles: FileList = element.files
    setFiles(Array.from(selectedFiles))
    onSelectFiles(Array.from(selectedFiles))
  }

  const classes = makeStyles(theme => ({
    fileUploadWrapper: {
      width: '100%',
      display: 'flex',
    },
    fileUploadButton: {
      marginLeft: theme.spacing(4),
    },
    fileUploadInput: {
      '& .MuiFilledInput-inputMarginDense': {
        paddingTop: '10px',
        paddingBottom: '10px',
      },
      flexGrow: 1,
    },
  }))()

  return (
    <div className={classes.fileUploadWrapper}>
      <TextField
        size="small"
        className={classes.fileUploadInput}
        InputProps={{
          readOnly: true,
        }}
        value={files && Array.from(files).map(x => x.name)}
      />
      <label htmlFor="file-upload-button">
        <input
          id="file-upload-button"
          name="file-upload-button"
          // TODO should be updated from Storybook to handle errors and some other stuff in JIRA ticket is https://jirasd.rim.net/browse/UES-2992
          accept={acceptedFiles || '*'}
          style={{ display: 'none' }}
          type="file"
          aria-label="labeled-file-upload-button"
          onChange={e => selectFiles(e)}
        />
        <Button size="medium" component="span" variant="contained" color="primary" className={classes.fileUploadButton}>
          {t('fileUpload.browseFilesButton')}
        </Button>
      </label>
    </div>
  )
}

export default FileUpload
