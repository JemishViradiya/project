/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import type { ConfirmationProps } from '@ues/behaviours'
import { useControlledDialog } from '@ues/behaviours'
// import type { ConfirmationProps } from '../../components'
// import type { ConfirmationProps } from '../../enhancements/Dialog'
// import { useControlledDialog } from '../../enhancements/Dialog'

type UseDeleteProfilesConfirmationReturn = {
  confirmationOptions: ConfirmationProps
  confirmDelete: (rows: any[]) => void
}

export const useDeleteProfilesConfirmation = (
  unselectAll: () => void,
  onDeletePolicy: (rows: any[]) => void,
): UseDeleteProfilesConfirmationReturn => {
  const { t } = useTranslation(['profiles'])
  const [confirmationOptions, setConfirmationOptions] = useState<ConfirmationProps>()

  const submitDelete = (rows: any[]) => {
    onDeletePolicy(rows)
    unselectAll()
    setConfirmationOptions(undefined)
  }

  const { open, onClose } = useControlledDialog({
    dialogId: Symbol('confirmDeletePolicy'),
    onClose: () => setConfirmationOptions(undefined),
  })

  const confirmDelete = (rows: any[]) => {
    if (rows.length > 1) {
      setConfirmationOptions({
        open,
        title: t('policy.delete.title'),
        description: t('policy.delete.multipleDelete'),
        content: (
          <>
            <div className="MuiTypography-gutterBottom">{t('policy.delete.note')}</div>
            {rows.map(s => (
              <Typography variant="h4" key={s['policyId']}>
                {s['name']}
              </Typography>
            ))}
          </>
        ),
        cancelButtonLabel: t('policy.cancelButton'),
        confirmButtonLabel: t('policy.deleteButton'),
        onConfirm: () => {
          submitDelete(rows)
        },
        onCancel: onClose,
      })
    } else {
      const selected = rows[0]
      const selectedName = selected ? selected.name : null
      setConfirmationOptions({
        open,
        title: t('policy.delete.title'),
        description: t('policy.delete.deleteSingle', {
          profile: selectedName,
        }),
        content: t('policy.delete.note'),
        cancelButtonLabel: t('policy.cancelButton'),
        confirmButtonLabel: t('policy.deleteButton'),
        onConfirm: () => {
          submitDelete(rows)
        },
        onCancel: onClose,
      })
    }
  }

  return { confirmationOptions, confirmDelete }
}
