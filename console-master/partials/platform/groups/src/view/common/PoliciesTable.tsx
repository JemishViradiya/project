import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { TableCellProps } from '@material-ui/core'
import { IconButton, List, ListItem, ListItemText, Paper, Popover, Typography } from '@material-ui/core'

import type { PolicyTypeWithEntities } from '@ues-data/platform'
import type { ReconciliationEntity } from '@ues-data/shared'
import { BasicAddRound, BasicDelete } from '@ues/assets'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { BasicTable, TableProvider, useControlledDialog, usePopover } from '@ues/behaviours'

import { AssignPolicyDialog } from './AssignPolicyDialog'
import { paperStyles } from './styles'

const idFunction = row => row.entityId

export type GroupPoliciesTableProps = {
  assignedPolicies: ReconciliationEntity[]
  assignablePolicies: PolicyTypeWithEntities[]
  onProfilesAssign: (p: ReconciliationEntity[], reconciliationType: string) => void
  onDelete: (p: ReconciliationEntity) => void
  loading?: boolean
}

export const PoliciesTable = (props: GroupPoliciesTableProps & { readonly?: boolean }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const { assignedPolicies, onDelete, assignablePolicies, onProfilesAssign, loading, readonly } = props
  const { paper } = paperStyles()

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const alignRight: TableCellProps['align'] = 'right'
  const COLUMNS = useMemo(() => {
    const actionColumn = {
      dataKey: 'action',
      renderCell: (rowData: any, rowDataIndex: number) => {
        return (
          <IconButton size="small" onClick={() => onDelete(rowData)} title={t('groups.policyAssign.removePolicy')}>
            <BasicDelete />
          </IconButton>
        )
      },
      icon: true,
      align: alignRight,
      renderLabel: () => (
        <IconButton size="small" onClick={handlePopoverClick} title={t('groups.policyAssign.addPolicy')}>
          <BasicAddRound />
        </IconButton>
      ),
      styles: { width: 30 },
    }

    const columns = [
      {
        dataKey: 'name',
        label: t('groups.policyAssign.name'),
      },
      {
        dataKey: 'entityType',
        label: t('groups.policyAssign.typeColumn'),
        renderCell: (rowData: any) => {
          return t('groups.policyAssign.type.' + rowData.entityType)
        },
      },
      {
        dataKey: 'description',
        label: t('groups.policyAssign.description'),
      },
    ]

    return readonly ? columns : [...columns, actionColumn]
  }, [onDelete, handlePopoverClick, t, readonly])

  const [dialogStateId, setDialogStateId] = useState<UseControlledDialogProps['dialogId']>()
  const [assignmentType, setAssignmentType] = useState<PolicyTypeWithEntities>(null)
  const dialogProps = useControlledDialog({
    dialogId: dialogStateId,
    onClose: useCallback(reason => {
      setDialogStateId(undefined)
    }, []),
  })

  const basicProps = useMemo(
    () => ({
      columns: COLUMNS,
      idFunction,
      loading,
      embedded: true,
    }),
    [COLUMNS, loading],
  )

  const typesWithLabels = useMemo(() => {
    const types =
      assignablePolicies?.map(type => ({
        ...type,
        disabled: type.policies.length === 0,
        label: t('groups.policyAssign.type.' + type.entityType),
      })) ?? []
    types.sort((a, b) => a.label.localeCompare(b.label))
    return types
  }, [assignablePolicies, t])

  const noDataPlaceholder = readonly ? t('noData') : t('groups.policyAssign.placeholder')

  return (
    <Paper variant="outlined" className={paper} role="region" aria-label={t('groups.policyAssign.policies')}>
      <Typography variant="h2">{t('groups.policyAssign.policies')}</Typography>
      <TableProvider basicProps={basicProps}>
        <BasicTable data={assignedPolicies ?? []} noDataPlaceholder={noDataPlaceholder} />
      </TableProvider>
      <Popover anchorEl={popoverAnchorEl} onClose={handlePopoverClose} open={popoverIsOpen}>
        <List role="list">
          {typesWithLabels?.map((type, i) => (
            <ListItem
              key={type.entityType}
              button
              dense
              disabled={type.disabled}
              onClick={() => {
                setAssignmentType(type)
                setDialogStateId(Symbol('assignment'))
                handlePopoverClose()
              }}
            >
              <ListItemText id={type.entityType} primary={type.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
      <AssignPolicyDialog
        {...dialogProps}
        onSave={onProfilesAssign}
        reconciliationType={assignmentType?.reconciliationType}
        assignable={assignmentType?.policies}
        assigned={assignedPolicies.filter(p => p.entityType === assignmentType?.entityType)}
      />
    </Paper>
  )
}
