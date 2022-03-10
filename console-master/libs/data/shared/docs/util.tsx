import React from 'react'

import { actions } from '@storybook/addon-actions'

import { ErrorBoundary } from './ErrorBoundary'

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

export const DefaultArgs = { Failure: false, Mock: false, withErrorBoundary: false }
export type DefaultArgs = typeof DefaultArgs
export const argTypes = {
  Failure: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: false },
    description: 'Query Failure',
  },
  Mock: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: false },
    description: 'Query with Mocked backend',
  },
  withErrorBoundary: {
    control: {
      type: 'boolean',
    },
    defaultValue: { summary: false },
    description: 'Query with errors propagated to a React Error Boundary',
  },
}

export const ListArgs = { Mode: 'progressive', Failure: false, Mock: false, withErrorBoundary: false }
export type ListArgs = typeof ListArgs
export const listArgTypes = {
  Mode: {
    ...argTypes.Mock,
    control: {
      type: 'inline-radio',
      options: ['paged', 'progressive'],
    },
  },
  ...argTypes,
}

export const timeFormatter = new Intl.DateTimeFormat('en', {
  minute: 'numeric',
  second: 'numeric',
  hour: 'numeric',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fractionalSecondDigits: 3,
})

const { renderActionImpl } = actions(
  {
    renderActionImpl: 'render',
  },
  {
    clearOnStoryChange: false,
  },
)
export const renderAction = (...args) => renderActionImpl(timeFormatter.format(new Date()), ...args)

const preStyle = { margin: '1em' }

export const Data = ({ data }) => (
  <pre style={preStyle}>
    <code>{JSON.stringify(data, null, 2)}</code>
  </pre>
)

export const Fallback = ({ cause = 'Suspense' }) => (
  <pre style={preStyle}>
    <code>{cause} Fallback</code>
  </pre>
)
export const ErrorFallback = ({ error, cause = 'ErrorBoundary' }: { error?: Error; cause?: string }) => (
  <pre style={preStyle}>
    <code>
      {cause} Fallback{'\n\t'}
      {'\n'}
      {error.stack}
    </code>
  </pre>
)
export const Loading = () => <Fallback cause="Loading" />
export const ErrorComponent = props => <ErrorFallback cause="Error" {...props} />

export const decorators = []

/* eslint-disable @typescript-eslint/no-var-requires */
const storyData = require('./storydata.json')

export type MoreDataResult<T> = {
  data: T[]
  pageInfo: { limit: number; offset: number; hasMore: boolean }
}

export function getMoreData<T = unknown>(limit: number, offset: number, extSourceData?, start?): MoreDataResult<T> {
  const sourceData = extSourceData ?? storyData

  const result: MoreDataResult<T> = {
    data: [],
    pageInfo: {
      limit: limit,
      offset: offset,
      hasMore: false,
    },
  }

  const startIndex = result.pageInfo.offset
  let endIndex = startIndex + result.pageInfo.limit
  if (endIndex > sourceData.data.length) {
    endIndex = sourceData.data.length
  }
  result.data = sourceData.data.slice(start ? 0 : startIndex, endIndex)
  result.pageInfo.offset = offset + Math.min(result.data.length, limit)
  if (endIndex < sourceData.data.length) {
    result.pageInfo.hasMore = true
  }

  return result
}

export type PageDataResult<T> = {
  data: T[]
  pageInfo: { limit: number; page: number; prev: number | null; next: number | null }
}

export function getPageData<T = unknown>(limit: number, page: number, extSourceData?): PageDataResult<T> {
  const sourceData = extSourceData ?? storyData

  const result: PageDataResult<T> = {
    data: [],
    pageInfo: {
      limit,
      page: page,
      prev: null,
      next: null,
    },
  }
  const startIndex = (page - 1) * limit
  let endIndex = page * limit
  if (endIndex > sourceData.data.length) {
    endIndex = sourceData.data.length
  }
  result.data = sourceData.data.slice(startIndex, endIndex)
  if (startIndex > 0) {
    result.pageInfo.prev = page - 1
  }
  if (endIndex < sourceData.data.length) {
    result.pageInfo.next = page + 1
  }

  return result
}

/* eslint-disable @typescript-eslint/no-var-requires */
const mockData = require('./mockdata.json')

export function getMockMoreData<T>(limit, offset, start?) {
  return getMoreData<T>(limit, offset, mockData, start)
}

export function getMockPageData<T>(limit, page) {
  return getPageData<T>(limit, page, mockData)
}
