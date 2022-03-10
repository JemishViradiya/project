import React from 'react'
import { useTranslation } from 'react-i18next'

import type { IconButtonProps } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import type { ExportRecord } from '@ues-data/export'
import { BasicExport } from '@ues/assets'

import type { ExportActionProp } from '../hooks/useExportAction'
import { useExportAction } from '../hooks/useExportAction'
import type { ExportDialogType } from './ExportDialog'

export interface ExportActionProps<StreamResult extends ExportRecord> {
  exportAction: ExportActionProp<StreamResult>
  IconButtonProps?: Partial<Omit<IconButtonProps, 'onClick'>>
  DialogProps?: Partial<
    Omit<React.ComponentProps<ExportDialogType>, 'isDownloading' | 'open' | 'close' | 'onClose' | 'handleSubmit'>
  >
}

const DefaultIconButtonProps: Partial<Omit<IconButtonProps, 'onClick'>> = { size: 'small' }
const DefaultDialogProps: ExportActionProps<ExportRecord>['DialogProps'] = { isFilterable: true }
export function ExportAction<TRecord extends ExportRecord>({
  exportAction,
  IconButtonProps = DefaultIconButtonProps,
  DialogProps = DefaultDialogProps,
}: ExportActionProps<TRecord>): JSX.Element {
  const [onExportClick, exportDialog] = useExportAction(exportAction)
  const { t } = useTranslation(['components', 'general/form'])

  return (
    <>
      <IconButton onClick={onExportClick} {...IconButtonProps} title={t('general/form:commonLabels.export')}>
        <BasicExport />
      </IconButton>
      {exportDialog ? <React.Suspense fallback={null}>{React.cloneElement(exportDialog, DialogProps)}</React.Suspense> : null}
    </>
  )
}
