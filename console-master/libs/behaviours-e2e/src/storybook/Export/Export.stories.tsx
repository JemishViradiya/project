import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ExportActionResult } from '@ues-behaviour/export'
import { ExportAction, exportFileName } from '@ues-behaviour/export'
import { resolveExportStreamFeatures, useExportAsyncQuery } from '@ues-data/export'
import type { AsyncQuery } from '@ues-data/shared'

import { useServiceWorkerDecorator } from '../utils'
import markdown from './export.md'
import CODE from './Export.stories?raw'

const ExportBatchSize = 1000
const ExportEndSize = ExportBatchSize * 100

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const ExportStreamFeatures = resolveExportStreamFeatures()

interface ExportItem {
  id: string
  option?: string
  label?: string
}
interface ExportData {
  items: Array<ExportItem>
}
interface ExportVariables {
  start?: number
  count?: number
  fetchDelay?: number
}

const exportQuery: AsyncQuery<ExportData, ExportVariables> = {
  query: async ({ start = 0, count = ExportBatchSize, fetchDelay } = {}) => {
    if (fetchDelay) await delay(fetchDelay)
    const data = { items: [] }
    const end = start + count
    for (let i = start; i < end; i++) {
      data.items.push({ id: `export-item-${i}` })
    }
    return data
  },
  permissions: new Set(),
  mockQueryFn: null,
  iterator: ({ start, count = ExportBatchSize, ...rest }: ExportVariables) => {
    const newStart = start + count
    if (newStart >= ExportEndSize) return null
    return { start: newStart, count, ...rest }
  },
}
exportQuery.mockQueryFn = exportQuery.query

export const Export = ({
  fileName,
  contentType,
  fetchDelay,
  fetchCount = ExportBatchSize,
  preferredImplementation,
  isFilterable,
}) => {
  const { t } = useTranslation('tables')

  const exportSource = useExportAsyncQuery(exportQuery)
  const exportAction = useCallback(
    async (opts): ExportActionResult<ExportItem> => {
      return {
        source: await exportSource({
          variables: { start: 0, count: fetchCount, fetchDelay },
          selector: ({ items }: ExportData) => {
            // add translations
            for (const item of items) {
              item.label = t(item.option || 'option')
            }
            return items
          },
        }),
        fileName: exportFileName(fileName, opts),
        contentType,
        preferredImplementation,
      }
    },
    [exportSource, fetchCount, fetchDelay, fileName, contentType, preferredImplementation, t],
  )
  // OR with a ReactHook
  // const [onExportClick, exportDialog] = useExportAction(exportAction)
  // return (
  //   <>
  //     <IconButton onClick={onExportClick}>
  //       <BasicExport />
  //     </IconButton>
  //     {React.cloneElement(exportDialog, { isFilterable })}
  //   </>
  // )
  return <ExportAction exportAction={exportAction} DialogProps={{ isFilterable }} />
}

export default {
  title: 'Export',
  component: Export,
  parameters: {
    controls: {
      expanded: true,
    },
    docs: {
      source: {
        // code: Export.toString(),
        code: CODE,
      },
    },
    notes: { Introduction: markdown },
  },
  argTypes: {
    contentType: {
      description: 'Content type to generate for download',
      control: {
        type: 'select',
        options: ['text/csv', 'application/x-ndjson'],
      },
      defaultValue: 'text/csv',
    },
    fileName: {
      description: 'Base FileName for the download. Will be appended with export date',
      control: {
        type: 'text',
      },
      defaultValue: 'export',
    },
    preferredImplementation: {
      description: 'Export implementation preference. Only supported implementations will be used if specified',
      control: {
        type: 'select',
        options: Object.entries(ExportStreamFeatures)
          .filter(([k, v]) => v)
          .map(([k]) => k),
      },
    },
    isFilterable: {
      description: 'Support optional filtering of the download',
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    fetchDelay: {
      description: 'Storybook download fetch delay. Applicable to storybook example only',
      control: {
        type: 'number',
      },
      defaultValue: '0',
    },
    fetchCount: {
      description: 'Storybook download fetch batch size. Applicable to storybook example only',
      control: {
        type: 'number',
      },
      defaultValue: ExportBatchSize,
    },
  },
  decorators: [(storyFn, _context) => useServiceWorkerDecorator(storyFn())],
}
