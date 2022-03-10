### ✨ Form Grid Layout

This component is built on top of Material UI Grid for using with [react-hook-form](hhttps://react-hook-form.com)

## 🔨 Usage

Example:

```tsx
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormGridLayout, { useFormGridLayoutDefaultValues, makeFormGridLayoutValues } from 'FormLayout'
import InputGroups from 'InputGroups'

const initialValues = [
  [
    [
      { name: 'John', email: 'john@test.com', age: 25 },
      { name: 'Robin', email: 'robin@test.com', age: 20 },
      { name: 'Rachel', email: 'rachel@test.com', age: 30 },
    ],
    [{ address: 'This Street 1' }, { address: 'This Street 2' }],
  ],
  [
    [{ name: 'Jack', email: 'jack@test.com', age: 55 }],
    [{ address: 'The Other Street 1' }, { address: 'The Other Street 2' }, { address: 'The Other Street 3' }],
  ],
]

const fieldsModelColumn1 = {
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

const fieldsModelColumn2 = {
  address: {
    type: FieldModelType.Text,
    label: 'Address',
    name: 'address',
  },
}

const columns = [
  {
    dataKey: 'col1',
    renderCell: () => <InputGroups fieldsModel={fieldsModelColumn1} />,
  },
  {
    dataKey: 'col2',
    renderCell: () => <InputGroups fieldsModel={fieldsModelColumn2} />,
  },
]

const InputGroupsLayout = () => {
  const defaultValues = useFormGridLayoutDefaultValues(initialValues)

  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues,
  })

  const formGridLayoutValues = makeFormGridLayoutValues({ columns, formInstance })

  return (
    <FormProvider {...formInstance}>
      <form>
        <FormGridLayout initialValues={initialValues} columns={columns} />
      </form>
    </FormProvider>
  )
}
```
