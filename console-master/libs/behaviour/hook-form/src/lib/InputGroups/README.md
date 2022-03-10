### ✨ Input Groups component

This component is built on top of Material UI components and React Hook Form

## 🔨 Usage

### With a custom validation and initial values

Validation rules are all based on HTML standard and also allow custom validation [react-hook-form](hhttps://react-hook-form.com/v6/api#register)

Example:

```tsx
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import InputGroups, { useInputGroupsDefaultValues, useInputGroupsValues, FieldModelType } from '@ues-behaviour/hook-form'

const initialValues = [
  { name: 'John', email: 'john@test.com', age: 25 },
  { name: 'Robin', email: 'robin@test.com', age: 20 },
]

const fieldsModel = {
  name: {
    type: FieldModelType.Text,
    label: 'Username',
    name: 'name',
    validationRules: {
      required: 'Name is required!',
      minLength: {
        value: 3,
        message: 'Name must be at least 3 characters!',
      },
    },
  },
  email: {
    type: FieldModelType.Text,
    label: 'E-mail',
    name: 'email',
    validationRules: {
      required: 'Email is required!',
      pattern: {
        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: 'Enter a valid email!',
      },
    },
  },
  age: {
    type: FieldModelType.Text,
    label: 'Age',
    name: 'age',
    validationRules: {
      required: 'Age is is required!',
      validate: {
        integer: value => Number.isInteger(Number(value)) || 'Age must be an integer!',
        positive: value => parseInt(value) > 0 || 'Age must be a number greater than 0!',
      },
    },
  },
}

const InputGroupsWithCustomValidation = () => {
  const { defaultValues } = useInputGroupsDefaultValues({ initialValues, fieldsModel })

  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues,
  })

  const inputGroupsValues = useInputGroupsValues(formInstance)

  return (
    <FormProvider {...formInstance}>
      <form>
        <InputGroups initialValues={initialValues} fieldsModel={fieldsModel} />
      </form>
    </FormProvider>
  )
}
```
