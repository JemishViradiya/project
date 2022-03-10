import { useMemo } from 'react'

import { useEventHandler } from '@ues-behaviour/react'

export default (formMethods, loading, onSubmit) => {
  const { handleSubmit, reset, formState, errors } = formMethods
  const submitDisabled = loading || formState.isSubmitting || !formState.isDirty || !!Object.keys(errors).length
  const resetDisabled = loading || formState.isSubmitting || !formState.isDirty

  const onReset = useEventHandler(() => {
    if (!resetDisabled) {
      reset()
    }
  }, [resetDisabled, reset])

  const doSubmit = useMemo(
    () =>
      handleSubmit(values => {
        if (!submitDisabled) {
          return onSubmit(values, { reset })
        }
      }),
    [submitDisabled, handleSubmit, reset, onSubmit],
  )

  return {
    resetDisabled,
    onReset,
    submitDisabled,
    onSubmit: doSubmit,
  }
}
