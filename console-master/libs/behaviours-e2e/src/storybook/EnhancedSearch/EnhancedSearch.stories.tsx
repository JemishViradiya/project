//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'

import type { EnhancedFieldConfig } from '@ues/behaviours'
import {
  EnhancedSearch as EnhancedSearchComponent,
  EnhancedSearchComparisonType,
  FILTER_TYPES,
  NumericFilterUnits,
} from '@ues/behaviours'

const TIME_OUT = 500

export const Simple = args => {
  const [dynamicOptions, setDynamicOptions] = useState([
    { label: 'Andrew', value: '01' },
    { label: 'John', value: '02' },
    { label: 'Stephan', value: '03' },
    { label: 'David', value: '04' },
  ])
  const [optionsAreLoading, setOptionsAreLoading] = useState(false)

  const updateOptions = () => {
    setOptionsAreLoading(true)
    setTimeout(() => {
      setOptionsAreLoading(false)
      setDynamicOptions([
        ...dynamicOptions,
        ...[
          { label: 'Tomas', value: '05' },
          { label: 'Kate', value: '06' },
          { label: 'Julia', value: '07' },
          { label: 'Max', value: '08' },
        ],
      ])
    }, TIME_OUT)
  }

  const data: EnhancedFieldConfig[] = [
    {
      type: FILTER_TYPES.NUMERIC,
      label: 'User Count',
      options: [],
      dataKey: 'userCount',
      min: 0,
      max: 100,
      unit: NumericFilterUnits.Gram,
    },
    {
      type: FILTER_TYPES.NUMERIC_RANGE,
      label: 'Users Range',
      options: [],
      dataKey: 'userRange',
      preselectComparison: EnhancedSearchComparisonType.DoesNotContain,
      min: 0,
      max: 100,
      unit: NumericFilterUnits.Percent,
    },
    {
      type: FILTER_TYPES.TEXT,
      label: 'User',
      options: [
        { label: 'Andrew', value: '01' },
        { label: 'John', value: '02' },
        { label: 'Stephan', value: '03' },
        { label: 'David', value: '04' },
      ],
      customOperators: [EnhancedSearchComparisonType.Contains, EnhancedSearchComparisonType.DoesNotContain],
      dataKey: 'userId',
    },
    {
      type: FILTER_TYPES.TEXT,
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Guest', value: 'guest' },
      ],
      dataKey: 'roleId',
    },
    {
      type: FILTER_TYPES.CHECKBOX,
      allowDuplicate: true,
      preselectComparison: true,
      label: 'Available users',
      options: [
        { label: 'Andrew', value: '01' },
        { label: 'John', value: '02' },
        { label: 'Stephan', value: '03' },
        { label: 'David', value: '04' },
      ],
      dataKey: 'userIds',
    },
    {
      type: FILTER_TYPES.RISK,
      label: 'Risk',
      dataKey: 'risk',
      customOperators: [EnhancedSearchComparisonType.Contains],
      riskProps: { withSecured: true },
    },
    {
      type: FILTER_TYPES.LIST,
      label: 'Available - List',
      dataKey: 'userIdsList',
      customOperators: [EnhancedSearchComparisonType.Contains],
      listProps: {
        onSearch: updateOptions,
        onFetchMore: updateOptions,
      },
      options: [],
    },
  ]

  const asyncFieldsProps = {
    userIdsList: {
      options: dynamicOptions,
      loading: optionsAreLoading,
      total: 4,
    },
  }

  return (
    <div>
      <div>
        <EnhancedSearchComponent
          fields={data}
          condensed={args.condensed}
          showChipSeparator={args.showChipSeparator}
          onChange={(data, key) => console.log('CB ===>', data, key)}
          disabled={args.disabled}
          asyncFieldsProps={asyncFieldsProps}
        />
      </div>
      {args.showTwoComponents && (
        <div style={{ marginTop: args.condensed ? '15px' : '60px' }}>
          <EnhancedSearchComponent
            fields={data}
            condensed={args.condensed}
            showChipSeparator={args.showChipSeparator}
            onChange={(data, key) => console.log('CB ===>', data, key)}
            disabled={args.disabled}
            asyncFieldsProps={asyncFieldsProps}
          />
        </div>
      )}
    </div>
  )
}

Simple.argTypes = {
  condensed: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
    description: 'Select proper type depending on purpose',
  },
  showTwoComponents: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
    description: 'Show two enhanced search components',
  },
  disabled: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
    description: 'Disable enhanced search',
  },
  showChipSeparator: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: false },
    description: 'Show or hide separator',
  },
}
