import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon, IconButton, Typography } from '@material-ui/core'

import type { DirectoryInstanceSyncSchedule } from '@ues-data/platform'
import { DAILY, INTERVAL, intervals, ONCE, syncTypes } from '@ues-data/platform'
import { TimeInline, TimeRangeInline } from '@ues-platform/shared'
import { BasicDelete } from '@ues/assets'
import { BasicTable, ContentAreaPanel, TableProvider, TableToolbar } from '@ues/behaviours'

import AddScheduleDialog from './AddScheduleDialog'
import { useDirectoryPermissions } from './directoryHooks'
import { SyncScheduleTableActions } from './SyncScheduleTableActions'
import type { ExtendedSyncSchedule } from './types'

interface SyncScheduleTableProps {
  schedules: (DirectoryInstanceSyncSchedule & { id?: string })[]
  onAddSchedule: (newSchedule: DirectoryInstanceSyncSchedule) => void
  onRemoveSchedule: (scheduleId: string) => void
}

export const SyncScheduleTable = memo(({ schedules, onAddSchedule, onRemoveSchedule }: SyncScheduleTableProps) => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState<boolean>(false)
  const { canUpdate } = useDirectoryPermissions()
  const { t } = useTranslation(['platform/common', 'platform/time'])

  const handleRemoveSchedule = useCallback(scheduleId => onRemoveSchedule(scheduleId), [onRemoveSchedule])

  // Opens Add schedule dialog
  const handleOpenAddSchedule = () => {
    console.debug('Handle open  add schedule dialog ')
    setScheduleDialogOpen(true)
  }

  // Closes Add schedule dialog
  const handleCloseAddSchedule = useCallback(
    newSchedule => {
      onAddSchedule(newSchedule)
      setScheduleDialogOpen(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onAddSchedule, schedules],
  )

  // Adds a new schedul and closes Add scedule dialog
  const handleCancelAddSchedule = () => {
    // console.debug('Cancel add schedule')
    setScheduleDialogOpen(false)
  }

  const showScheduleDialog = useCallback(() => {
    return (
      scheduleDialogOpen && (
        <AddScheduleDialog
          open={scheduleDialogOpen}
          onClose={handleCloseAddSchedule}
          onCancel={handleCancelAddSchedule}
          schedules={schedules}
        />
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleDialogOpen])

  const renderRecurrence = useCallback(
    (schedule: DirectoryInstanceSyncSchedule) => {
      const { iterations, callbackFreq, startTimeOfDay, endTimeOfDay } = schedule

      switch (iterations) {
        case INTERVAL:
          return (
            <>
              <div>
                {t('directory.syncSchedule.everyNumMinutes', {
                  minutes: callbackFreq,
                })}
              </div>
              <TimeRangeInline timeRange={{ from: startTimeOfDay, to: endTimeOfDay }} />
            </>
          )
        case ONCE:
          return <TimeInline time={startTimeOfDay} />
        case DAILY:
          return <TimeInline time={startTimeOfDay} />
        default:
          return <div />
      }
    },
    [t],
  )

  const renderDeleteButton = useCallback(
    rowData => {
      const title = canUpdate && t('directory.syncSchedule.remove')
      return (
        canUpdate && (
          <IconButton aria-label={title} onClick={() => handleRemoveSchedule(rowData.id)} size="small" title={title}>
            <Icon component={BasicDelete} />
          </IconButton>
        )
      )
    },
    [canUpdate, handleRemoveSchedule, t],
  )

  const renderDays = useCallback(
    (schedule: ExtendedSyncSchedule) => {
      const days = schedule.iterations === ONCE ? [schedule.selectedDay] : schedule.selectedDays
      return <div>{days.map(x => t('platform/time:medium.' + x)).join(', ')}</div>
    },
    [t],
  )

  const COLUMNS = useMemo(
    () => [
      {
        label: t('directory.syncSchedule.type'),
        dataKey: 'name',
        width: 40,
        renderCell: (rowData: ExtendedSyncSchedule) => t(syncTypes[rowData.type]),
        persistent: true,
        sortable: true,
      },
      {
        label: t('directory.syncSchedule.recurrence'),
        dataKey: 'type',
        renderCell: (rowData: ExtendedSyncSchedule) => t(intervals[rowData.iterations]),
        persistent: true,
        sortable: true,
      },
      {
        label: t('directory.syncSchedule.time'),
        dataKey: 'emailAddress',
        renderCell: (rowData: ExtendedSyncSchedule) => renderRecurrence(rowData),
        persistent: true,
      },
      {
        label: t('directory.syncSchedule.days'),
        dataKey: 'emailAddress',
        renderCell: (rowData: ExtendedSyncSchedule) => renderDays(rowData),
        persistent: true,
      },
      {
        dataKey: 'action',
        renderCell: (rowData: ExtendedSyncSchedule) => renderDeleteButton(rowData),
        icon: true,
      },
    ],
    [renderDeleteButton, renderRecurrence, renderDays, t],
  )
  const idFunction = rowData => rowData.id

  return (
    <>
      {showScheduleDialog()}
      <ContentAreaPanel title={t('directory.syncSchedule.title')}>
        <Typography variant="body2" align="left" gutterBottom>
          {t('directory.syncSchedule.description')}
        </Typography>

        <TableProvider basicProps={{ columns: COLUMNS, idFunction: idFunction }}>
          {canUpdate && <TableToolbar begin={<SyncScheduleTableActions onAdd={() => handleOpenAddSchedule()} />} />}
          <BasicTable
            noDataPlaceholder={t('directory.syncSchedule.emptyTableMessage')}
            data={schedules}
            title={t('directory.syncSchedule.title')}
          />
        </TableProvider>
      </ContentAreaPanel>
    </>
  )
})
