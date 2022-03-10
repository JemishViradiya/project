/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import type { ConfirmationProps, UseSelected } from '@ues/behaviours'
import { useControlledDialog } from '@ues/behaviours'

type UseUnassignMembersConfirmationReturn = {
  confirmationOptions: ConfirmationProps
  confirmDelete: (rows: any[]) => void
}

export const useUnassignMembersConfirmation = (
  selectedProps: UseSelected<any>,
  data: any[],
  onUnassign: (assignment: { userIds: string[]; groupIds: string[] }) => void,
): UseUnassignMembersConfirmationReturn => {
  const { t } = useTranslation(['profiles'])
  const [confirmationOptions, setConfirmationOptions] = useState<ConfirmationProps>()

  const { open, onClose } = useControlledDialog({
    dialogId: Symbol('confirmUnassignMembers'),
    onClose: () => setConfirmationOptions(undefined),
  })

  const onSubmitUnassignment = () => {
    if (selectedProps && selectedProps.selected.length > 0) {
      const assignment = { userIds: [], groupIds: [] }

      selectedProps.selected.forEach(a => {
        const item = data.find(d => d.id === a)
        if (item['__typename'] === 'User') {
          assignment.userIds.push(a)
        } else if (item['__typename'] === 'Group') {
          assignment.groupIds.push(a)
        }
      })

      onUnassign(assignment)
      selectedProps?.resetSelectedItems()
    }
    setConfirmationOptions(undefined)
  }

  const confirmDelete = () => {
    const rows = data.filter(d => selectedProps.selected.includes(d.id))
    if (rows.length > 0) {
      setConfirmationOptions({
        open,
        title: t('policy.assignment.unassign.title'),
        description: t('policy.assignment.unassign.content'),
        content: (
          <div>
            {rows.map(s => (
              <Typography variant="h4" key={s['id']}>
                {s['__typename'] === 'User' ? s['displayName'] : s['name']}
              </Typography>
            ))}
          </div>
        ),
        cancelButtonLabel: t('policy.cancelButton'),
        confirmButtonLabel: t('policy.removeButton'),
        onConfirm: () => {
          onSubmitUnassignment()
          setConfirmationOptions(undefined)
        },
        onCancel: onClose,
      })
    }
  }

  return { confirmationOptions, confirmDelete }
}
