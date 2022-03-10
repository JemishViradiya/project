import React, { useCallback, useState } from 'react'

import type { ExportRecord, ExportStreamOptions } from '@ues-data/export'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { useControlledDialog } from '@ues/behaviours'

import { ExportDialog } from '../components/ExportDialog'
import { useExportStream } from './useExport'

export type ExportActionProp<StreamResult> = (opts?: { filtered: boolean }) => Promise<ExportStreamOptions<StreamResult>>
export type ExportActionResult<StreamResult> = ReturnType<ExportActionProp<StreamResult>>

export const useExportAction = <StreamResult extends ExportRecord>(
  exportAction: ExportActionProp<StreamResult>,
): [(...args: unknown[]) => void, JSX.Element] => {
  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const [isDownloading, setDownloading] = useState(false)

  const { open, onClose } = useControlledDialog({
    dialogId: dialogStateId,
    onClose: React.useCallback(reason => {
      console.log('useExportAction.onClose')
      setDownloading(false)
      setDialogStateId(undefined)
    }, []),
  })

  const download = useExportStream()

  const handleSubmit = useCallback(
    async (options: { filtered: boolean }) => {
      setDownloading(true)
      try {
        const downloadOptions = await exportAction(options)
        await download<StreamResult>(downloadOptions)
      } finally {
        console.log('useExportAction.complete')
        onClose()
      }
    },
    [download, exportAction, onClose],
  )

  const onExportClick = useCallback(() => {
    setDialogStateId(Symbol('export-dialog' + Math.random()))
  }, [])

  const exportDialog = dialogStateId ? (
    <ExportDialog isDownloading={isDownloading} open={open} onClose={onClose} onSubmit={handleSubmit} />
  ) : null
  return [onExportClick, exportDialog]
}
