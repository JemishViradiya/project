//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { FC } from 'react'
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDialogPrompt } from '@ues/behaviours'

const FormConfirmation: FC = memo(() => {
  const { formState } = useFormContext()
  return useDialogPrompt('general/form:navigationConfirmation.message', formState.isDirty)
})

export default FormConfirmation
