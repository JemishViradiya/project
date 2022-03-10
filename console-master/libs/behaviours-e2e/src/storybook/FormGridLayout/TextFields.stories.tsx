import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FieldModelType, FormGridLayout, InputGroups } from '@ues-behaviour/hook-form'

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

export const TextFields = () => {
  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues: {},
  })

  const handleChange = () => console.log('formValues: ', formInstance.getValues())

  return (
    <FormProvider {...formInstance}>
      <form>
        <FormGridLayout
          onChange={handleChange}
          columns={[
            {
              dataKey: 'col1',
              renderCell: () => <InputGroups fieldsModel={fieldsModelColumn1} />,
              label: 'User data',
            },
            {
              dataKey: 'col2',
              renderCell: () => <InputGroups fieldsModel={fieldsModelColumn2} />,
              label: 'User address',
            },
          ]}
        />
      </form>
    </FormProvider>
  )
}
