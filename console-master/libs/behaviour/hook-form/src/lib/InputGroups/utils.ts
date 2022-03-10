//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { InputGroupsProps } from './types'

const makeObjectPath = ({
  fieldsModel,
  fieldIndex,
  fieldKey,
  gridIndex,
}: {
  fieldsModel: InputGroupsProps['fieldsModel']
  fieldIndex: number
  fieldKey: string
  gridIndex: string
}) => {
  const basePath = `${fieldIndex}.${fieldsModel[fieldKey].name}`

  return gridIndex ? `${gridIndex}.${basePath}` : basePath
}

export const makeFieldModel = ({
  fieldsModel,
  fieldIndex,
  gridIndex,
}: {
  fieldsModel: InputGroupsProps['fieldsModel']
  fieldIndex: number
  gridIndex: string
}) =>
  Object.keys(fieldsModel).map(fieldKey => ({
    ...fieldsModel[fieldKey],
    name: makeObjectPath({ fieldsModel, fieldIndex, fieldKey, gridIndex }),
  }))
