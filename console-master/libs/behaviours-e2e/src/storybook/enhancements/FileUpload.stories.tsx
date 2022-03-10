import React, { useState } from 'react'

import { Box, Typography } from '@material-ui/core'

import { FileUpload as FileUploadComponent } from '@ues/behaviours'

export const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList>()
  const handleSelectFiles = files => {
    setSelectedFiles(files)
  }

  return (
    <Box alignContent="left" width="500px">
      <FileUploadComponent onSelectFiles={handleSelectFiles} />
    </Box>
  )
}

FileUpload.args = {}

export default {
  title: 'Enhancements/Input/File Upload',
  argTypes: {
    ampm: {
      table: {
        disable: true,
      },
    },
    minutesStep: {
      table: {
        disable: true,
      },
    },
  },
}
