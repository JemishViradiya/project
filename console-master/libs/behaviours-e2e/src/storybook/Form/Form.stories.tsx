import React, { useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import type { KeyboardTimePickerProps } from '@material-ui/pickers'

import { Form as FormComponent } from '@ues-behaviour/hook-form'

import { reallyLongString } from '../utils'
import markdown from './form.md'

const FormStory = args => {
  const [show, setShow] = useState(true)
  const [benefitValue, setBenefitValue] = useState<boolean>(false)
  const sliderName = 'percentageSlider'
  const disabledSliderName = 'disabledSlider'

  return (
    <>
      <Typography variant="h3">TextField</Typography>
      <FormComponent
        fields={[
          {
            type: 'text',
            name: 'name',
            label: 'Name',
            disabled: false,
            helpLabel: args.showHelpText && 'Enabled Help label text.',
          },
          {
            type: 'text',
            name: 'jobPosition',
            label: 'Job Position',
            disabled: true,
            helpLabel: args.showHelpText && 'Disabled Help label text.',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">Select</Typography>
      <FormComponent
        initialValues={{ device: 'macBookAir' }}
        fields={[
          {
            type: 'select',
            name: 'device',
            label: 'Select Device',
            options: [
              { label: 'MacBook Air', value: 'macBookAir' },
              { label: 'MacBook Pro', value: 'macBookPro' },
            ],
            helpLabel: args.showHelpText && reallyLongString,
            disabled: false,
          },
          {
            type: 'select',
            name: 'disabledDevice',
            label: 'Select Second Device',
            options: [
              { label: 'MacBook Air', value: 'macBookAir' },
              { label: 'MacBook Pro', value: 'macBookPro' },
            ],
            disabled: true,
            helpLabel: args.showHelpText && reallyLongString,
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">Toggle (Switch)</Typography>
      <FormComponent
        initialValues={{ enableAccessories: true }}
        fields={[
          {
            type: 'switch',
            name: 'enableAccesories',
            label: 'Add accessories',
            helpLabel: args.showHelpText && !show && reallyLongString,
          },
        ]}
        onChange={() => setShow(!show)}
        hideButtons
      />
      <FormComponent
        initialValues={{ enableAccessories: true }}
        fields={[
          {
            type: 'switch',
            name: 'disabledAccessories',
            label: 'Disabled switch',
            disabled: true,
            helpLabel: args.showHelpText && reallyLongString,
          },
        ]}
        onChange={() => setShow(!show)}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">MultiLine</Typography>
      <FormComponent
        initialValues={{ filledMultiline: ['default data', 'for multiline', 'element'] }}
        fields={[
          {
            type: 'multiLine',
            name: 'multilineElement',
            label: 'MultiLine',
            helpLabel: args.showHelpText && 'Required.',
          },
          {
            type: 'multiLine',
            name: 'filledMultiline',
            label: 'Filled multiLine',
            helpLabel: args.showHelpText && 'Required.',
          },
          {
            type: 'multiLine',
            name: 'disabledMultiline',
            label: 'Disabled multiLine',
            helpLabel: args.showHelpText && 'Required.',
            disabled: true,
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">MultiSelect</Typography>
      <FormComponent
        initialValues={{ accessories: ['headphones', 'cell'] }}
        fields={[
          {
            type: 'multiSelect',
            name: 'accessories',
            label: 'Select additional accessories',
            options: [
              { label: 'Headphones', value: 'headphones' },
              { label: 'Cell', value: 'cell' },
              { label: 'Dell Monitor', value: 'monitor' },
            ],
            helpLabel: args.showHelpText && 'You can choose up to 2 accessories.',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <FormComponent
        fields={[
          {
            type: 'multiSelect',
            name: 'disabledAccessories',
            label: 'Disabled accessories',
            options: [
              { label: 'Headphones', value: 'headphones', disabled: true },
              { label: 'Cell', value: 'cell', disabled: true },
              { label: 'Dell Monitor', value: 'monitor', disabled: true },
            ],
            disabled: true,
            helpLabel: args.showHelpText && 'You can choose up to 2 accessories.',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">RadioGroup</Typography>
      <FormComponent
        fields={[
          {
            type: 'radioGroup',
            name: 'androidType',
            options: [
              {
                label: 'Available option',
                value: 'true',
                disabled: false,
              },
              {
                label: 'Available option 2',
                value: 'false',
                disabled: false,
              },
              {
                label: 'Unavailable option 3',
                value: false,
                disabled: true,
              },
              {
                label: 'Unavailable option 4',
                value: false,
                disabled: true,
              },
              {
                label: 'Unavailable option5',
                value: false,
                disabled: true,
              },
            ],
            helpLabel: args.showHelpText && 'Select available options',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">Checkbox</Typography>
      <FormComponent
        initialValues={{ disabledBenefit: true }}
        fields={[
          {
            type: 'checkbox',
            name: 'disabledBenefit',
            label: 'Health Benefit',
            disabled: true,
          },
        ]}
        onChange={() => setBenefitValue(!benefitValue)}
        hideButtons
      />
      <FormComponent
        fields={[
          {
            type: 'checkbox',
            name: 'healthBenefit',
            label: 'Sport Benefit',
            helpLabel: args.showHelpText && 'Choose available benefits',
          },
        ]}
        onChange={() => setBenefitValue(!benefitValue)}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">Time</Typography>
      <FormComponent
        fields={[
          {
            type: 'time',
            name: 'startTime',
            label: 'Enter time',
            muiProps: {
              ampm: true,
              minutesStep: 5,
            } as KeyboardTimePickerProps,
            disabled: false,
            helpLabel: args.showHelpText && 'Datetime picker label!',
          },
        ]}
        hideButtons
      />
      <FormComponent
        fields={[
          {
            type: 'time',
            name: 'disabledTime',
            label: 'Disabled time',
            muiProps: {
              ampm: true,
              minutesStep: 5,
            } as KeyboardTimePickerProps,
            disabled: true,
            helpLabel: args.showHelpText && 'Datetime picker label!',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">Slider</Typography>
      <FormComponent
        fields={[
          {
            type: 'slider',
            name: sliderName,
            label: 'Slider',
            unit: '%',
            min: 0,
            max: 100,
            disabled: false,
            helpLabel: args.showHelpText && 'Slider help label!',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <FormComponent
        fields={[
          {
            type: 'slider',
            name: disabledSliderName,
            label: 'Slider',
            unit: 'Hz',
            min: 10,
            max: 1000,
            disabled: true,
            helpLabel: args.showHelpText && 'Slider help label!',
          },
        ]}
        hideButtons
      />
      <Box style={{ marginBottom: 25 }} />
      <Typography variant="h3">CheckboxGroup</Typography>
      <FormComponent
        initialValues={{ sampleOptions: { secondCheckbox: true } }}
        fields={[
          {
            type: 'checkboxGroup',
            name: 'sampleOptions',
            label: 'Sample checkboxGroup fields',
            options: [
              {
                label: 'label',
                value: 'firstCheckbox',
              },
              {
                label: 'default label',
                value: 'secondCheckbox',
              },
              {
                label: 'disabled label',
                value: 'thirdCheckbox',
                disabled: true,
              },
            ],
            helpLabel: args.showHelpText && 'Help label for checkboxGroup field.',
          },
        ]}
      />
    </>
  )
}

export const Form = FormStory.bind({})

Form.args = {
  showHelpText: false,
}

export default {
  title: 'Form/Form Structure',
  component: FormStory,
  parameters: {
    notes: { Introduction: markdown },
  },
  argTypes: {
    layout: {
      control: {
        type: 'inline-radio',
        options: ['inline', 'vertical'],
      },
      defaultValue: 'vertical',
      description: 'Layout style',
    },
    showHelpText: {
      control: { type: 'boolean' },
    },
  },
}
