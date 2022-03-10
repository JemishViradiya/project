//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEqual } from 'lodash-es'
import React, { useEffect, useState } from 'react'

import { Box, IconButton } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { BasicAdd } from '@ues/assets'

import { useInputGroupsDefaultValues } from './hooks'
import InputGroup from './InputGroup'
import type { FieldModelInterface, InputGroupsProps } from './types'
import { makeFieldModel } from './utils'

const InputGroups: React.FC<InputGroupsProps> = ({
  appendItem,
  disabled,
  fieldsModel,
  initialValues,
  gridIndex,
  onBlur,
  onChange,
  maxFieldsCount,
  addButtonContainerMuiProps,
  autoFocus,
}) => {
  const { defaultFieldsGroups, initialGroupIndex } = useInputGroupsDefaultValues({ initialValues, fieldsModel, gridIndex })
  const [autoFocusOnAdd, setAutoFocusOnAdd] = useState<boolean>(false)

  const [groupIndex, setGroupIndex] = useState<number>(initialGroupIndex)
  const [fieldsGroups, setFieldsGroups] = useState<FieldModelInterface[][]>(defaultFieldsGroups)

  const previousFieldsGroups = usePrevious(fieldsGroups)
  const fieldsCount = fieldsGroups.length

  const handleAdd = () => {
    setFieldsGroups([...fieldsGroups, makeFieldModel({ fieldsModel, fieldIndex: groupIndex, gridIndex })])
    setGroupIndex(groupIndex + 1)
    setAutoFocusOnAdd(true)
  }

  const handleRemove = (index: number) => {
    const updatedFieldsGroup = [...fieldsGroups]

    updatedFieldsGroup.splice(index, 1)
    setFieldsGroups(updatedFieldsGroup)
  }

  useEffect(() => {
    if (typeof onChange === 'function' && !isEqual(previousFieldsGroups, fieldsGroups)) {
      onChange()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousFieldsGroups, fieldsGroups])

  const handleAppendItem = () => {
    if (typeof appendItem === 'function') {
      return appendItem(gridIndex, fieldsCount)
    }
  }

  const shouldShowAddButton = !disabled && (maxFieldsCount ? fieldsCount < maxFieldsCount : true)

  const handleAutoFocus = (fieldIndex: number) => {
    return autoFocus || (autoFocusOnAdd && fieldIndex === 0)
  }

  return (
    <>
      {fieldsGroups.map((fields, index) => (
        <InputGroup
          disabled={disabled}
          fields={fields}
          hideRemoveButton={fieldsCount === 1}
          index={index}
          key={fields[0].name}
          onChange={onChange}
          onBlur={onBlur}
          onRemove={() => handleRemove(index)}
          onAutoFocus={handleAutoFocus}
        />
      ))}
      {handleAppendItem()}
      {shouldShowAddButton && (
        <Box mt={3} {...addButtonContainerMuiProps}>
          <IconButton size="small" onClick={() => handleAdd()} aria-label="add-input-group-button">
            <BasicAdd />
          </IconButton>
        </Box>
      )}
    </>
  )
}

export default InputGroups
