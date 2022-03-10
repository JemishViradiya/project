import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IconButton, MenuItem, TextField } from '@material-ui/core'

import { PolicyData } from '@ues-data/dlp'
import { BasicDelete } from '@ues/assets'
import { Select } from '@ues/behaviours'

import { DELETE_RULE, UPDATE_RULE } from './json-logic-helper/types'
import { conditionBuilderStyles } from './styles'
import { useDataTypes } from './useDataTypes'

const MAX_OCCURRENCE_VALUE = 10

type RuleItem = {
  id: number
  minOccurrenceValue: number
  onChange?: any
  titleGuid: string
  editable: boolean
}

const ConditionRule = ({ id, onChange, minOccurrenceValue, titleGuid, editable }: RuleItem) => {
  const { dataTypes, selectedDataTypeName } = useDataTypes(titleGuid)
  const { rule, occurrence, occurrenceLabel, selectWrapper, button, iconButton, selectPlaceholder } = conditionBuilderStyles()
  const { t } = useTranslation('dlp/policy')
  const selectPlaceholderText = t('policy.sections.conditions.builder.select.placeholderText')
  const localPolicyData = useSelector(PolicyData.getLocalPolicyData)

  const [minOccurrence, setMinOccurrence] = useState(minOccurrenceValue)
  const [dataTypeName, setDataTypeName] = useState(selectedDataTypeName)

  useEffect(() => {
    setDataTypeName(selectedDataTypeName)
  }, [selectedDataTypeName])

  useEffect(() => {
    setMinOccurrence(minOccurrenceValue)
  }, [minOccurrenceValue])

  const handleSelect = e => {
    setDataTypeName(e.target.value)
    const selectedDataType = dataTypes.find(d => d.name === e.target.value)
    onChange(UPDATE_RULE, id, { titleGuid: selectedDataType.guid })
  }

  const handleOccurrenceChange = e => {
    if (Number(e.target.value) === 0 || Number(e.target.value) < 0 || e.target.value.length > 2) {
      return
    }
    setMinOccurrence(e.target.value)
    if (e.target.value) {
      onChange(UPDATE_RULE, id, { value: Number(e.target.value) })
    }
  }

  const onDeleteRule = () => {
    onChange(DELETE_RULE, id)
  }

  const renderSelectedValue = () => {
    return !dataTypeName ? <span className={selectPlaceholder}>{selectPlaceholderText + ' *'}</span> : dataTypeName
  }

  const setHelperText = () => {
    if (minOccurrence < 0 || minOccurrence > MAX_OCCURRENCE_VALUE) {
      return t('policy.sections.conditions.builder.occurrences.rangeText')
    }
  }

  return (
    <div className={'group-or-rule ' + rule}>
      <Select
        displayEmpty={!dataTypeName}
        renderValue={renderSelectedValue}
        value={dataTypeName}
        size="small"
        variant="filled"
        wrapperClassName={selectWrapper}
        required
        onChange={handleSelect}
        disabled={!editable}
      >
        {dataTypes?.map((d, i) => {
          return (
            <MenuItem key={i} value={d.name}>
              {d.name}
            </MenuItem>
          )
        })}
      </Select>
      <span className={occurrenceLabel}>{t('policy.sections.conditions.builder.label')}</span>
      <TextField
        type="number"
        className={occurrence}
        value={minOccurrence}
        onChange={handleOccurrenceChange}
        name="minOccurrence"
        placeholder="1"
        size="small"
        margin="none"
        error={!minOccurrence || minOccurrence < 0 || minOccurrence > MAX_OCCURRENCE_VALUE}
        helperText={setHelperText()}
        disabled={!editable}
      />
      {editable && (
        <IconButton className={`${button} ${iconButton}`} color="default" onClick={onDeleteRule} size="small">
          <BasicDelete color="primary" />
        </IconButton>
      )}
    </div>
  )
}

export default ConditionRule
