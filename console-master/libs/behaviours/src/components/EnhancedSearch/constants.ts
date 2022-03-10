//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { EnhancedSearchComparisonType } from './types'

export const DEFAULT_COMPARISON_OPTIONS = [
  {
    label: 'enhancedSearch.comparisons.contains',
    value: EnhancedSearchComparisonType.Contains,
  },
  {
    label: 'enhancedSearch.comparisons.doesNotContain',
    value: EnhancedSearchComparisonType.DoesNotContain,
  },
  {
    label: 'enhancedSearch.comparisons.startsWith',
    value: EnhancedSearchComparisonType.StartsWith,
  },
  {
    label: 'enhancedSearch.comparisons.endsWith',
    value: EnhancedSearchComparisonType.EndsWith,
  },
]

export const EXTRA_COMPARISON_OPTIONS = [
  {
    label: 'enhancedSearch.comparisons.greater',
    value: EnhancedSearchComparisonType.Greater,
  },
  {
    label: 'enhancedSearch.comparisons.greaterOrEqual',
    value: EnhancedSearchComparisonType.GreaterOrEqual,
  },
  {
    label: 'enhancedSearch.comparisons.less',
    value: EnhancedSearchComparisonType.Less,
  },
  {
    label: 'enhancedSearch.comparisons.lessOrEqual',
    value: EnhancedSearchComparisonType.LessOrEqual,
  },
]

export const COMPARISON_OPTIONS = [...DEFAULT_COMPARISON_OPTIONS, ...EXTRA_COMPARISON_OPTIONS]

export const CHIP_VALUE_TOOLTIP_DELAY = 800
