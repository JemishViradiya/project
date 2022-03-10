//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved. .

import cn from 'classnames'
import { get, isArray, isNil, omitBy } from 'lodash-es'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { CheckboxProps, RadioGroupProps, SwitchProps, TextFieldProps } from '@material-ui/core'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from '@material-ui/core'

import { useFormFieldLayout } from '../hooks/use-form-field-layout'
import type { EnhancedValidate, FormFieldProps } from '../types'
import { FormFieldLayout, FormFieldType } from '../types'
import { makeDefaultFieldValue } from '../utils'
import CheckboxGroupField from './checkbox-group-field'
import MultiSelectField from './multi-select-field'
import MultilineField from './multiline-field'
import { SelectFormField } from './select-form-field'
import SliderField from './slider-field'
import useStyles from './styles'
import { TimePickerField } from './time-picker-field'

const DEFAULT_MUI_PROPS = {
  fullWidth: true,
}

const FormField: React.FC<FormFieldProps> = ({ formField, onBlur, onChange }) => {
  const { t } = useTranslation(['general/form'])
  const formInstance = useFormContext()
  const { field: formFieldController, meta: formFieldInputState } = useController({
    control: formInstance?.control,
    defaultValue: makeDefaultFieldValue(formField),
    name: formField.name,
    rules: omitBy(
      {
        ...formField.validationRules,
        validate:
          typeof formField.validationRules?.validate === 'function'
            ? value =>
                (formField.validationRules?.validate as EnhancedValidate)(
                  isArray(value) ? value.filter(String) : value,
                  formInstance,
                  formField.name,
                )
            : formField.validationRules?.validate,
      },
      isNil,
    ),
  })

  const hasError = Boolean(formFieldInputState.invalid)

  const fieldLayoutClasses = useFormFieldLayout(formField.type)
  const fieldGeneralClasses = useStyles()

  const resolveHelperText = () => {
    const errorMessage = get(formInstance?.errors ?? {}, formField.name)?.message || t('validationErrors.invalid')
    return hasError ? errorMessage : formField.helpLabel
  }

  const renderHelperText = () =>
    hasError || formField.helpLabel ? (
      <FormHelperText
        className={cn({
          [fieldLayoutClasses?.[FormFieldLayout.HelperDisabledText]]: formField.disabled,
          [fieldLayoutClasses?.[FormFieldLayout.HelperText]]: !formField.disabled,
          [fieldGeneralClasses.error]: hasError,
        })}
      >
        {resolveHelperText()}
      </FormHelperText>
    ) : null

  const renderLabel = () => formField.label && <FormLabel component="label">{formField.label}</FormLabel>

  const renderCustomLabel = () => (typeof formField.renderLabel === 'function' ? formField.renderLabel() : formField.label)

  const handleFormFieldChange = (value: unknown) => {
    formFieldController.onChange(value)

    if (typeof onChange === 'function') {
      onChange()
    }
  }

  const handleFormFieldBlur = (event: React.SyntheticEvent) => {
    formFieldController.onBlur()

    if (typeof onBlur === 'function') {
      onBlur({ value: (event.target as HTMLInputElement).value, formInstance, formFieldName: formField.name })
    }
  }

  const fieldDisabled =
    typeof formField.disabled === 'function' ? formField.disabled(formField.name, formInstance.getValues()) : formField.disabled

  const FORM_FIELD_COMPONENTS = {
    [FormFieldType.Text]: (
      <TextField
        {...formFieldController}
        id={formField.name}
        name={formField.name}
        error={hasError}
        helperText={resolveHelperText()}
        className={fieldLayoutClasses?.[FormFieldLayout.Field]}
        type="text"
        size="small"
        {...{
          ...DEFAULT_MUI_PROPS,
          ...(formField?.muiProps as TextFieldProps),
          inputProps: { 'aria-autocomplete': 'list', ...((formField?.muiProps as TextFieldProps)?.inputProps ?? {}) },
        }}
        label={formField.label}
        hiddenLabel={!formField.label}
        required={formField?.required}
        onChange={event => handleFormFieldChange(event.target.value)}
        onBlur={handleFormFieldBlur}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={formField?.autoFocus}
        disabled={fieldDisabled}
      />
    ),

    [FormFieldType.Select]: (
      <SelectFormField
        {...formFieldController}
        name={formField?.name}
        options={formField?.options}
        muiProps={{ ...DEFAULT_MUI_PROPS, ...(formField?.muiProps ?? {}) }}
        onChange={value => handleFormFieldChange(value)}
        helperText={resolveHelperText()}
        disabled={fieldDisabled}
        required={formField?.required}
        error={hasError}
        label={formField.label}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={formField?.autoFocus}
      />
    ),

    [FormFieldType.MultiSelect]: (
      <MultiSelectField
        {...formFieldController}
        muiProps={formField?.muiProps}
        disabled={fieldDisabled}
        label={formField.label}
        options={formField.options}
        placeholder={formField?.placeholder}
        onChange={value => handleFormFieldChange(value)}
        error={hasError}
        required={formField?.required}
        helperText={resolveHelperText()}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={formField?.autoFocus}
      />
    ),

    [FormFieldType.MultiLine]: (
      <MultilineField
        {...formFieldController}
        name={formField.name}
        muiProps={formField?.muiProps}
        disabled={fieldDisabled}
        label={formField.label}
        onChange={value => handleFormFieldChange(value)}
        error={hasError}
        required={formField?.required}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={formField?.autoFocus}
        helperText={resolveHelperText()}
      />
    ),

    [FormFieldType.Time]: (
      <TimePickerField
        {...formFieldController}
        muiProps={formField?.muiProps}
        disabled={fieldDisabled}
        error={hasError}
        label={formField.label}
        helperText={formField?.helpLabel}
        onChange={value => handleFormFieldChange(value)}
        required={formField?.required}
      />
    ),

    [FormFieldType.Switch]: (
      <Box className={fieldLayoutClasses?.[FormFieldLayout.Field]}>
        <FormControlLabel
          control={
            <Switch
              {...formFieldController}
              {...(formField?.muiProps as SwitchProps)}
              inputProps={{
                'aria-label': formField.name,
              }}
              checked={formFieldController.value ?? false}
              disabled={fieldDisabled}
              name={formField.name}
              onChange={event => handleFormFieldChange(event.target.checked)}
              required={formField?.required}
            />
          }
          label={renderCustomLabel()}
        />
        {renderHelperText()}
      </Box>
    ),

    [FormFieldType.Checkbox]: (
      <Box className={fieldLayoutClasses?.[FormFieldLayout.Field]}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              color="secondary"
              {...(formField?.muiProps as CheckboxProps)}
              {...formFieldController}
              disabled={fieldDisabled}
              name={formField.name}
              onChange={event => handleFormFieldChange(event.target.checked)}
              checked={formFieldController.value ?? false}
              required={formField?.required}
            />
          }
          className={fieldLayoutClasses?.[FormFieldLayout.Label]}
          label={renderCustomLabel()}
          disabled={fieldDisabled}
        />
        {renderHelperText()}
      </Box>
    ),

    [FormFieldType.CheckboxGroup]: (
      <>
        {renderLabel()}
        <Box className={formField.type}>
          <CheckboxGroupField
            muiProps={formField?.muiProps}
            value={formFieldController.value}
            options={formField.options}
            onChange={value => handleFormFieldChange(value)}
            required={formField?.required}
            disabled={fieldDisabled}
          />
        </Box>
        {renderHelperText()}
      </>
    ),

    [FormFieldType.RadioGroup]: (
      <>
        {renderLabel()}
        <Box className={formField.type}>
          <RadioGroup
            {...formFieldController}
            {...(formField?.muiProps as RadioGroupProps)}
            onChange={event => handleFormFieldChange(event.target.value)}
            name={formField.name}
          >
            {formField.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                control={<Radio size="small" />}
                label={option.label}
                value={option.value}
                disabled={fieldDisabled}
                className={fieldLayoutClasses?.[FormFieldLayout.Label]}
              />
            ))}
          </RadioGroup>
        </Box>
        {renderHelperText()}
      </>
    ),

    [FormFieldType.Slider]: (
      <>
        <SliderField
          {...formFieldController}
          muiProps={formField?.muiProps}
          min={formField.min}
          max={formField.max}
          unit={formField.unit}
          onChange={value => handleFormFieldChange(value)}
          disabled={fieldDisabled}
          required={formField?.required}
        />
        {renderHelperText()}
      </>
    ),
  }

  const hasPrimaryStyle = (!formField.secondary && !formField.tertiary) || formField.primary

  const fieldComponent = FORM_FIELD_COMPONENTS[formField.type]

  return (
    <FormControl
      className={cn({
        [fieldGeneralClasses.primary]: hasPrimaryStyle,
        [fieldGeneralClasses.secondary]: !hasPrimaryStyle && formField.secondary,
        [fieldGeneralClasses.tertiary]: !hasPrimaryStyle && formField.tertiary,
      })}
    >
      {typeof formField?.renderComponent === 'function'
        ? formField.renderComponent({
            fieldClassNames: fieldGeneralClasses,
            fieldComponent,
            fieldValue: formFieldController.value,
          })
        : fieldComponent}
    </FormControl>
  )
}

export default FormField
