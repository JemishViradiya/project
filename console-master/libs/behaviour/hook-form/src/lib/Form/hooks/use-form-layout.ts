//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import type { FormFieldInterface, FormLayout } from '../types'
import { FormFieldType, FormLayoutType } from '../types'

const DEFAULT_LAYOUT: FormLayout = {
  type: 'vertical',
  config: { span: 1, offset: 0 },
}

const GROUP_FIELDS: FormFieldInterface['type'][] = [FormFieldType.CheckboxGroup, FormFieldType.RadioGroup]

interface LayoutStyleProps extends Pick<FormLayout, 'config'> {
  isGroupField: boolean
}

const useStyles = makeStyles<Theme, LayoutStyleProps>(theme => ({
  verticalGrid: {
    display: 'grid',
    gridAutoFlow: 'row',
    gridGap: ({ config: { offset } }) => offset,
    gridTemplateRows: ({ config: { span }, isGroupField }) => (isGroupField ? 'none' : `repeat(${span}, 1fr)`),

    '& .checkboxGroup, & .radioGroup': {
      display: 'grid',
      gridGap: ({ config: { offset } }) => offset,
      gridTemplateRows: ({ config: { span } }) => `repeat(${span}, 1fr)`,
      gridAutoFlow: 'dense',
      width: 'fit-content',
    },

    '& .MuiFormGroup-root': {
      display: 'grid',
      gridAutoFlow: 'row',
      gridGap: ({ config: { offset } }) => offset,
      gridTemplateRows: ({ config: { span } }) => `repeat(${span}, 1fr)`,
    },
  },

  inlineGrid: {
    display: 'grid',
    gridGap: ({ config: { offset } }) => offset,
    gridTemplateColumns: ({ config: { span }, isGroupField }) => (isGroupField ? 'none' : `repeat(${span}, 1fr)`),

    '& .checkboxGroup, & .radioGroup': {
      display: 'grid',
      gridAutoFlow: 'dense',
      gridGap: ({ config: { offset } }) => offset,
    },

    '& .radioGroup': {
      gridTemplateColumns: 'none',
    },

    '& .checkboxGroup': {
      gridTemplateColumns: ({ config: { span } }) => `repeat(${span}, 1fr)`,
    },

    '& .MuiFormGroup-root': {
      display: 'grid',
      gridGap: ({ config: { offset } }) => offset,
      gridTemplateColumns: ({ config: { span } }) => `repeat(${span}, 1fr)`,
    },
  },
}))

export const useFormLayout = (layout: FormLayout = DEFAULT_LAYOUT, fields: FormFieldInterface[] = []) => {
  const isGroupField = fields.some(field => GROUP_FIELDS.includes(field?.type))

  const classes = useStyles({ config: layout?.config, isGroupField })

  const formLayout = {
    [FormLayoutType.Inline]: classes.inlineGrid,
    [FormLayoutType.Vertical]: classes.verticalGrid,
  }

  return formLayout[layout.type]
}
