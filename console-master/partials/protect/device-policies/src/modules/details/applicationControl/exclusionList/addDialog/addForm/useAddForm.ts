import cond from 'lodash/cond'
import type { FormEvent } from 'react'
import type { FormState, Inputs } from 'react-use-form-state'
import { useFormState } from 'react-use-form-state'

import { ExclusionField } from './constants'
import type { Exclusion } from './types'
import { validate } from './utils'

interface UseAddFormInterface {
  formState: FormState<Exclusion>
  inputProps: Inputs<Exclusion>
  onSubmit: (e: FormEvent) => void
}

const useAddForm = (list: Array<string>, onAddToList: (path: string) => void): UseAddFormInterface => {
  // state
  const [formState, inputProps] = useFormState<Exclusion>({
    [ExclusionField.path]: '',
  })

  // actions

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const error = validate(list)(formState.values.path)

    cond([
      [() => error !== null, () => formState.setFieldError(ExclusionField.path, error)],
      [() => true, () => onAddToList(formState.values.path)],
    ])(undefined)
  }

  // hook interface
  return {
    formState,
    inputProps,
    onSubmit,
  }
}

export default useAddForm
