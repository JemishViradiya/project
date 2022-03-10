//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'

import type { FieldModelInterface, InputGroupsProps } from '../types'
import { makeFieldModel } from '../utils'

const FIRST_SLOT_INDEX = 1

export const useInputGroupsDefaultValues = ({
  initialValues,
  fieldsModel,
  gridIndex,
}: {
  initialValues: InputGroupsProps['initialValues']
  fieldsModel: InputGroupsProps['fieldsModel']
  gridIndex?: string
}) => {
  const defaultValues = useMemo(() => {
    return (initialValues ?? []).reduce<{ defaultFieldsGroups: FieldModelInterface[][]; defaultValues: Record<number, unknown> }>(
      (acc, record, index) => ({
        defaultFieldsGroups: [...acc.defaultFieldsGroups, makeFieldModel({ fieldIndex: index, fieldsModel, gridIndex })],
        defaultValues: { ...acc.defaultValues, [index]: record },
      }),
      {
        defaultFieldsGroups: isEmpty(initialValues) ? [makeFieldModel({ fieldIndex: 0, fieldsModel, gridIndex })] : [],
        defaultValues: {},
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, fieldsModel, gridIndex])

  const initialGroupIndex = useMemo(() => (isEmpty(initialValues) ? FIRST_SLOT_INDEX : initialValues.length), [initialValues])

  return { ...defaultValues, initialGroupIndex }
}
