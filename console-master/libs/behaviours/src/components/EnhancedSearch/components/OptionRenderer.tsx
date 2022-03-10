//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { FILTER_TYPES } from '../../../filters'
import { enhancedSearchActions, useEnhancedSearchContext } from '../EnhancedSearchProvider'
import { CheckboxField } from '../fields/Checkbox'
import { ListField } from '../fields/List'
import { Numeric } from '../fields/Numeric'
import { NumericRange } from '../fields/NumericRange'
import { RiskField } from '../fields/Risk'
import { Text } from '../fields/Text'
import { SearchStep } from '../types'
import { remapValuesWithListProps } from '../utils'

export const OptionRenderer = ({ option, classes, currentField, optionRef, handleOptionValueChange, asyncFieldsProps }) => {
  const {
    state: { values, step, searchValue, selectedFieldIndex },
    dispatch,
  } = useEnhancedSearchContext()
  const { t } = useTranslation(['components'])

  if (step === SearchStep.First) {
    return <Typography variant="body2">{option.label}</Typography>
  }
  if (step === SearchStep.Second) {
    return (
      <Box className={classes.comparisonContainer}>
        <Box>{option.value}</Box>
        <Box className={classes.comparisonEndText}>
          <Typography variant="caption">{t(option.label)}</Typography>
        </Box>
      </Box>
    )
  }
  if (step === SearchStep.Third) {
    const regexp = new RegExp(`${searchValue.toLocaleLowerCase()}`, 'gi')
    const filteredOptions = currentField?.nestedOptions?.filter(option => {
      const optionValue = option?.value && (typeof option.value === 'number' ? String(option.value) : option.value).match(regexp)
      return optionValue || option?.label?.match(regexp)
    })
    const componentsConfig = {
      [FILTER_TYPES.TEXT]: <Text options={filteredOptions} onChange={handleOptionValueChange} />,
      [FILTER_TYPES.CHECKBOX]: (
        <CheckboxField options={filteredOptions} onChange={handleOptionValueChange} values={currentField?.value} />
      ),
      [FILTER_TYPES.RISK]: (
        <RiskField {...currentField?.riskProps} onChange={handleOptionValueChange} value={currentField?.value} />
      ),
      [FILTER_TYPES.LIST]: (
        <ListField
          {...currentField?.listProps}
          options={currentField?.nestedOptions}
          asyncProps={asyncFieldsProps?.[currentField?.dataKey]}
          values={currentField?.value}
          onChange={handleOptionValueChange}
          updateSearchField={searchValue => {
            dispatch(
              enhancedSearchActions.updateListProps({
                values: remapValuesWithListProps(values, selectedFieldIndex, searchValue),
                searchValue,
                selectedFieldIndex,
                currentField: values[selectedFieldIndex],
              }),
            )
          }}
        />
      ),
      [FILTER_TYPES.NUMERIC]: <Numeric onChange={handleOptionValueChange} value={currentField?.value} config={currentField} />,
      [FILTER_TYPES.NUMERIC_RANGE]: (
        <NumericRange onChange={handleOptionValueChange} value={currentField?.value} config={currentField} />
      ),
    }
    return <div ref={optionRef}>{componentsConfig[currentField?.type]}</div>
  }
}
