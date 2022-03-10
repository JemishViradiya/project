//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type React from 'react'

import type { BoxProps } from '@material-ui/core'

import type { FormFieldInterface, FormInstance } from '../Form/types'

export enum FieldModelType {
  Text = 'text',
  Select = 'select',
  Checkbox = 'checkbox',
}

export interface FieldModelInterface extends Omit<FormFieldInterface, 'type' | 'renderComponent'> {
  type?: FieldModelType | `${FieldModelType}`
  renderComponent?: (args: {
    field: FieldModelInterface
    onChange: () => void
    index: number
    autoFocus?: boolean
  }) => React.ReactNode
}

export interface InputGroupProps {
  disabled?: boolean
  fields: FieldModelInterface[]
  hideRemoveButton?: boolean
  index: number
  onAutoFocus?: (fieldIndex: number) => boolean
  onBlur?: (args: { value: string; formInstance: FormInstance; formFieldName: string }) => void
  onChange: () => void
  onRemove?: () => void
}

export interface InputGroupsProps {
  appendItem?: (gridIndex: string, fieldsCount: number) => React.ReactNode
  disabled?: boolean
  fieldsModel: Record<string, FieldModelInterface>
  gridIndex?: string
  initialValues?: Array<Record<string, unknown>>
  onBlur?: (args: { value: string; formInstance: FormInstance; formFieldName: string }) => void
  onChange?: () => void
  maxFieldsCount?: number
  addButtonContainerMuiProps?: BoxProps
  autoFocus?: boolean
}
