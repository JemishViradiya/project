//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { FORM_MULTILINE_FIELD_VALUE_SEPARATOR } from './constants'
import { FormFieldType } from './types'
import { makeDefaultFieldValue, makeMultilineFieldValue, sanitizeForm } from './utils'

const FIRST_LINE_VALUE = '1.1.1.1'
const SECOND_LINE_VALUE = '1.1.1.11'
const MULTILINE_VALUE = `${FIRST_LINE_VALUE}${FORM_MULTILINE_FIELD_VALUE_SEPARATOR}${SECOND_LINE_VALUE}`

describe('Form utils', () => {
  describe('sanitizeForm', () => {
    const FORM_VALUES_WITH_NULL = { ip1: FIRST_LINE_VALUE, ip2: SECOND_LINE_VALUE, ip3: null }
    const FORM_VALUES_WITH_UNDEFINED = { ip1: FIRST_LINE_VALUE, ip2: SECOND_LINE_VALUE, ip3: undefined }
    const FORM_VALUES_WITH_ARRAYS = {
      ip1: ['', FIRST_LINE_VALUE],
      ip2: [SECOND_LINE_VALUE, ''],
      ip3: [FIRST_LINE_VALUE, '', SECOND_LINE_VALUE],
    }
    const EXPECTED_FORM_VALUES = { ip1: FIRST_LINE_VALUE, ip2: SECOND_LINE_VALUE }
    const EXPECTED_FORM_VALUES_WITH_ARRAYS = {
      ip1: [FIRST_LINE_VALUE],
      ip2: [SECOND_LINE_VALUE],
      ip3: [FIRST_LINE_VALUE, SECOND_LINE_VALUE],
    }

    it('should handle null in form values', () => {
      expect(sanitizeForm(FORM_VALUES_WITH_NULL)).toStrictEqual(EXPECTED_FORM_VALUES)
    })

    it('should handle undefined in form values', () => {
      expect(sanitizeForm(FORM_VALUES_WITH_UNDEFINED)).toStrictEqual(EXPECTED_FORM_VALUES)
    })

    it('should handle empty strings in arrays', () => {
      expect(sanitizeForm(FORM_VALUES_WITH_ARRAYS)).toStrictEqual(EXPECTED_FORM_VALUES_WITH_ARRAYS)
    })
  })

  describe('makeMultilineFieldValue', () => {
    it('should return an array with one item for single line', () => {
      expect(makeMultilineFieldValue(FIRST_LINE_VALUE)).toStrictEqual([FIRST_LINE_VALUE])
    })

    it('should return an array with two items for two lines', () => {
      expect(makeMultilineFieldValue(MULTILINE_VALUE)).toStrictEqual([FIRST_LINE_VALUE, SECOND_LINE_VALUE])
    })
  })

  describe('makeDefaultFieldValue', () => {
    const getFormField = (type: FormFieldType, defaultValue?: any) => ({
      type,
      name: 'ip',
      muiProps: {
        defaultValue,
      },
    })

    it('should return a proper defalut value when muiProps defaultValue is set', () => {
      expect(makeDefaultFieldValue(getFormField(FormFieldType.MultiSelect, ['test.com']))).toStrictEqual(['test.com'])
      expect(makeDefaultFieldValue(getFormField(FormFieldType.Checkbox, true))).toStrictEqual(true)
      expect(makeDefaultFieldValue(getFormField(FormFieldType.Text, 'google.com'))).toStrictEqual('google.com')
    })

    it('should return a proper defalut value for MultiSelect and MultiLine', () => {
      expect(makeDefaultFieldValue(getFormField(FormFieldType.MultiSelect))).toStrictEqual([])
      expect(makeDefaultFieldValue(getFormField(FormFieldType.MultiLine))).toStrictEqual([])
    })

    it('should return a proper defalut value for Checkbox and Switch', () => {
      expect(makeDefaultFieldValue(getFormField(FormFieldType.Checkbox))).toBe(false)
      expect(makeDefaultFieldValue(getFormField(FormFieldType.Switch))).toBe(false)
    })

    it('should return a proper defalut value for the rest of field types', () =>
      [
        FormFieldType.Text,
        FormFieldType.Time,
        FormFieldType.RadioGroup,
        FormFieldType.CheckboxGroup,
        FormFieldType.Select,
        FormFieldType.Slider,
      ].forEach(formField => expect(makeDefaultFieldValue(getFormField(formField))).toStrictEqual('')))
  })
})
