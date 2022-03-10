//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'

import { RiskLevel } from '@ues-data/shared'
import { EnhancedSearch as EnhancedSearchComponent, EnhancedSearchComparisonType, FILTER_TYPES } from '@ues/behaviours'

const TIME_OUT = 500

export const SimpleWithDefaultValues = args => {
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

  const data = [
    {
      type: FILTER_TYPES.NUMERIC,
      label: 'User Count',
      options: [],
      min: 0,
      max: 100,
      dataKey: 'userCount',
    },
    {
      type: FILTER_TYPES.NUMERIC_RANGE,
      label: 'Users Range',
      options: [],
      min: 0,
      max: 100,
      dataKey: 'userRange',
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
      customOperators: [EnhancedSearchComparisonType.Contains],
      riskProps: { withSecured: true },
      dataKey: 'risk',
    },
    {
      type: FILTER_TYPES.LIST,
      label: 'Available - List',
      customOperators: [EnhancedSearchComparisonType.Contains],
      listProps: {
        onSearch: updateOptions,
        onFetchMore: updateOptions,
      },
      options: [],
      dataKey: 'userIdsList',
    },
  ]

  const asyncFieldsProps = {
    userIdsList: {
      options: dynamicOptions,
      loading: optionsAreLoading,
      total: 4,
    },
  }

  const initialValues = [
    {
      dataKey: 'userId',
      operator: EnhancedSearchComparisonType.DoesNotContain,
      value: { label: 'Stephan', value: '03' },
    },
    {
      dataKey: 'userIds',
      operator: EnhancedSearchComparisonType.Contains,
      value: [
        { label: 'Andrew', value: '01' },
        { label: 'John', value: '02' },
      ],
    },
    {
      dataKey: 'userIds',
      operator: EnhancedSearchComparisonType.DoesNotContain,
      value: [{ label: 'Stephan', value: '03' }],
    },
    {
      dataKey: 'risk',
      operator: EnhancedSearchComparisonType.Contains,
      value: [RiskLevel.Medium, RiskLevel.High],
    },
  ]

  return (
    <EnhancedSearchComponent
      fields={data}
      initialValues={initialValues}
      condensed={args.condensed}
      showChipSeparator={args.showChipSeparator}
      onChange={(data, key) => console.log('CB ===>', data, key)}
      disabled={args.disabled}
      asyncFieldsProps={asyncFieldsProps}
    />
  )
}

SimpleWithDefaultValues.argTypes = {
  condensed: {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
    description: 'Select proper type depending on purpose',
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
