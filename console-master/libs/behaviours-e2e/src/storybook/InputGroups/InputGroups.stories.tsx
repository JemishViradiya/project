import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FieldModelType, InputGroups as InputGroupsComponent } from '@ues-behaviour/hook-form'

const makeFieldModel = ({ name, label, disabled }: { name: string; label: string; disabled: boolean }) => ({
  [FieldModelType.Text]: {
    type: FieldModelType.Text,
    label,
    name,
    disabled,
    validationRules: {
      required: 'Port is required!',
      validate: {
        integer: value => Number.isInteger(Number(value)) || 'Port must be an integer!',
        positive: value => parseInt(value) > 0 || 'Port must be greater than 0!',
      },
    },
  },
  [FieldModelType.Select]: {
    type: FieldModelType.Select,
    label,
    name,
    disabled,
    options: [
      { label: 'TCP', value: 'TCP' },
      { label: 'UDP', value: 'UDP' },
      { label: 'TCP or UDP', value: 'TCP or UDP' },
    ],
  },
  [FieldModelType.Checkbox]: {
    type: FieldModelType.Checkbox,
    label,
    name,
    disabled,
    options: [
      {
        label: 'All ports',
        value: false,
      },
    ],
  },
})

export const InputGroups = ({
  checkboxesLabel,
  disabled,
  numberOfCheckboxes,
  numberOfTextfields,
  numberOfSelects,
  selectsLabel,
  showError,
  textfieldsLabel,
}) => {
  const formInstance = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues: {},
  })

  useEffect(() => {
    if (showError) {
      const fieldName = '0.port-0' as never
      formInstance.setError(fieldName, { message: 'Port is required!' })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showError])

  const makeFieldData = (index: number) => ({
    [FieldModelType.Text]: {
      name: `port-${index}`,
      label: textfieldsLabel,
    },
    [FieldModelType.Select]: {
      name: `protocol-${index}`,
      label: selectsLabel,
    },
    [FieldModelType.Checkbox]: {
      name: `allPorts-${index}`,
      label: checkboxesLabel,
    },
  })

  const fieldsModel = {}

  const makeKeysArray = (index: number) => (index < 1 ? [] : [...new Array(index).keys()])

  const textFieldsKeys = useMemo(() => makeKeysArray(numberOfTextfields), [numberOfTextfields])
  const selectFieldsKeys = useMemo(() => makeKeysArray(numberOfSelects), [numberOfSelects])
  const checkboxFieldsKeys = useMemo(() => makeKeysArray(numberOfCheckboxes), [numberOfCheckboxes])

  const makeFieldsModel = (fieldsKeys: number[], type: FieldModelType) => {
    fieldsKeys.forEach(fieldKey => {
      const { name, label } = makeFieldData(fieldKey)[type]

      fieldsModel[name] = makeFieldModel({ name, label, disabled })[type]
    })
  }

  makeFieldsModel(textFieldsKeys, FieldModelType.Text)
  makeFieldsModel(selectFieldsKeys, FieldModelType.Select)
  makeFieldsModel(checkboxFieldsKeys, FieldModelType.Checkbox)

  const showInputGroups = !!(numberOfTextfields || numberOfSelects || numberOfCheckboxes)

  return (
    <FormProvider {...formInstance}>
      <form>{showInputGroups && <InputGroupsComponent fieldsModel={fieldsModel} disabled={disabled} />}</form>
    </FormProvider>
  )
}

InputGroups.args = {
  numberOfTextfields: 1,
  numberOfSelects: 0,
  numberOfCheckboxes: 0,
  showError: false,
  textfieldsLabel: 'Port',
  selectsLabel: 'Protocol',
  checkboxesLabel: 'All ports',
  disabled: false,
}

export default {
  title: 'Input Groups',
  argTypes: {
    numberOfTextfields: {
      control: {
        type: 'number',
        min: 0,
        max: 3,
        step: 1,
      },
      defaultValue: 1,
      description: 'Number of Textfields',
    },
    numberOfSelects: {
      control: {
        type: 'number',
        min: 0,
        max: 3,
        step: 1,
      },
      defaultValue: 0,
      description: 'Number of Selects',
    },
    numberOfCheckboxes: {
      control: {
        type: 'number',
        min: 0,
        max: 3,
        step: 1,
      },
      defaultValue: 0,
      description: 'Number of Checkboxes',
    },
    showError: {
      control: {
        type: 'boolean',
        defaultValue: false,
        description: 'Show validation error',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
        defaultValue: false,
        description: 'Disable inputs',
      },
    },
    textfieldsLabel: {
      control: {
        type: 'text',
        defaultValue: 'Port',
        description: 'Label for Textfields',
      },
    },
    selectsLabel: {
      control: {
        type: 'text',
        defaultValue: 'Protocol',
        description: 'Label for Selects',
      },
    },
    checkboxesLabel: {
      control: {
        type: 'text',
        defaultValue: 'All ports',
        description: 'Label for Checkboxes',
      },
    },
  },
}
