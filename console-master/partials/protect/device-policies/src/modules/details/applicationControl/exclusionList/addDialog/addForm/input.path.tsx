import React from 'react'
import { useTranslation } from 'react-i18next'
import type { FormState, InputElement, Inputs } from 'react-use-form-state'

import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import { useInputFormControlStyles } from '@ues/assets'

import { ExclusionField } from './constants'
import type { Exclusion } from './types'
import { validate } from './utils'

interface PathInputPropTypes {
  formState: FormState<Exclusion>
  inputProps: Inputs<Exclusion>
  list: Array<string>
}

const PathInput = ({ formState, inputProps, list }: PathInputPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])
  const theme = useTheme()
  const { root } = useInputFormControlStyles(theme)

  // actions

  const onBlur = (e: React.FocusEvent<InputElement>) => formState.setField(ExclusionField.path, e.target.value.trim())

  // render

  return (
    <TextField
      classes={{ root }}
      fullWidth
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      label={translate('folderPath')}
      inputProps={{
        ...inputProps.text({
          name: ExclusionField.path,
          validateOnBlur: true,
          onBlur,
          validate: validate(list),
        }),
      }}
      helperText={translate(formState.errors[ExclusionField.path])}
      error={formState.validity[ExclusionField.path] === false}
      data-autoid="application-control-add-exclusion-folder-input"
    />
  )
}

export default PathInput
