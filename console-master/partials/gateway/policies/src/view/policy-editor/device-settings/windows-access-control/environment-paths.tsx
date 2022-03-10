//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Chip } from '@material-ui/core'

import { Config } from '@ues-gateway/shared'

import useStyles from './styles'

const { ALLOWED_ENVIRONMENT_VARIABLES } = Config

const EnvironmentPaths: React.FC<{ isAddMode: boolean }> = ({ isAddMode }) => {
  const formInstance = useFormContext()
  const classes = useStyles()

  const handleClick = (path: string) => {
    const { applications } = formInstance.getValues()

    if (isAddMode) {
      formInstance.setValue('applications', [...applications, `${path}\\`])
    } else {
      const [_driveLetterOrEnvironmentVariable, ...rest] = applications.split('\\')
      formInstance.setValue('applications', `${path}\\${rest.join('\\')}`)
    }

    formInstance.trigger('applications')
  }

  return (
    <Box className={classes.wrapper}>
      {ALLOWED_ENVIRONMENT_VARIABLES.map(item => (
        <Chip key={item} color="default" clickable size="small" variant="outlined" label={item} onClick={() => handleClick(item)} />
      ))}
    </Box>
  )
}

export default EnvironmentPaths
