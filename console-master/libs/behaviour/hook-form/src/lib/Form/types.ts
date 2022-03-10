//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { FieldValues, RegisterOptions, Resolver, UseFormMethods, Validate, ValidateResult } from 'react-hook-form'

import type { CheckboxProps, RadioGroupProps, SelectProps, SliderProps, SwitchProps, TextFieldProps } from '@material-ui/core'
import type { KeyboardTimePickerProps } from '@material-ui/pickers'

import type useFieldStyles from './fields/styles'

export enum FormLayoutType {
  Inline = 'inline',
  Vertical = 'vertical',
}

export enum FormFieldLayout {
  Field = 'field',
  Label = 'label',
  HelperText = 'helperText',
  HelperDisabledText = 'helperDisabledText',
  EndIcon = 'endIcon',
  Theme = 'theme',
}

export type FormInstance = UseFormMethods<Record<string, unknown>>

export type FieldLayoutStyle = { classes: Partial<Record<FormFieldLayout, string>>; theme: Partial<Record<string, unknown>> }

export interface FormLayout {
  config?: {
    span?: number
    offset?: number
  }
  type: FormLayoutType | `${FormLayoutType}`
}

export enum FormFieldType {
  Text = 'text',
  Select = 'select',
  MultiSelect = 'multiSelect',
  MultiLine = 'multiLine',
  Time = 'time',
  Switch = 'switch',
  Checkbox = 'checkbox',
  RadioGroup = 'radioGroup',
  Slider = 'slider',
  CheckboxGroup = 'checkboxGroup',
}

export interface FormFieldOption {
  disabled?: boolean
  hidden?: boolean
  label: string
  value: any
}

export type EnhancedValidate = (value: unknown, formInstance: FormInstance, formFieldName: string) => ValidateResult

interface EnhancedRegisterOption extends Omit<RegisterOptions, 'validate'> {
  validate?: EnhancedValidate | Record<string, Validate>
}

export interface RenderComponentFnArgs {
  fieldClassNames: ReturnType<typeof useFieldStyles>
  fieldComponent: React.ReactNode
  fieldValue: any
}

export interface FormFieldInterface {
  disabled?: boolean | ((fieldName: string, formValues: any) => boolean)
  helpLabel?: string
  hidden?: boolean
  label?: string
  max?: number
  min?: number
  muiProps?: TextFieldProps | KeyboardTimePickerProps | SwitchProps | CheckboxProps | SliderProps | SelectProps
  name: string
  options?: FormFieldOption[]
  placeholder?: string
  primary?: boolean
  renderComponent?: (args: RenderComponentFnArgs) => React.ReactNode
  renderLabel?: () => React.ReactNode
  required?: boolean
  secondary?: boolean
  tertiary?: boolean
  type: FormFieldType | `${FormFieldType}`
  unit?: string
  validationRules?: EnhancedRegisterOption
  autoFocus?: boolean
}

export interface FormDataInterface {
  formValues?: any
}

export interface FormValidationDataInterface {
  isFormChanged?: boolean
  isFormValid?: boolean
}

export interface FormProps<T extends FieldValues = FieldValues> {
  cancelButtonLabel?: string
  fields: FormFieldInterface[]
  hideButtons?: boolean
  initialValues?: any
  isLoading?: boolean
  onCancel?: () => void
  onChange?: (formData: FormDataInterface) => void
  onValidationChange?: (formValidationData: FormValidationDataInterface) => void
  onSubmit?: (formData: any, formInstance?: FormInstance) => void
  submitButtonLabel?: string
  validateCancelButton?: boolean
  resolver?: Resolver<Record<string, any>, T>
  layout?: FormLayout
}

export interface FormFieldProps {
  formField: FormFieldInterface
  onChange?: () => void
  onBlur?: (args: { value: string; formInstance: FormInstance; formFieldName: string }) => void
}

export interface BaseFormFieldInputProps<TValue = unknown> {
  disabled?: boolean
  error?: boolean
  helperText?: React.ReactNode | string
  label?: string
  muiProps?: TextFieldProps | KeyboardTimePickerProps | SwitchProps | CheckboxProps | RadioGroupProps | SliderProps | SelectProps
  onBlur?: () => void
  onChange: (value: TValue) => void
  placeholder?: string
  ref?: React.Ref<HTMLDivElement>
  required?: boolean
  value: TValue
  name?: string
  autoFocus?: boolean
}
