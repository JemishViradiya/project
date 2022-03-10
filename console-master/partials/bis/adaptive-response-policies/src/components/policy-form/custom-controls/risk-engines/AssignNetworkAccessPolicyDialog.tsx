import type { TFunction } from 'i18next'
import React, { useCallback, useMemo } from 'react'

import { Dialog } from '@material-ui/core'

import type { FormFieldInterface, FormFieldOption } from '@ues-behaviour/hook-form'
import { Form, FormFieldType } from '@ues-behaviour/hook-form'
import type { UseControlledDialogProps } from '@ues/behaviours'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

interface AssignNetworkAccessPolicyDialogProps {
  dialogId?: UseControlledDialogProps['dialogId']
  policies?: FormFieldOption[]
  onSave?: (policy: FormFieldOption) => void
  t: TFunction
}

const POLICY_FIELD_NAME = 'policy'

const AssignNetworkAccessPolicyDialog: React.FC<AssignNetworkAccessPolicyDialogProps> = ({ dialogId, policies, onSave, t }) => {
  const { open, onClose } = useControlledDialog({
    dialogId,
  })

  const onSubmit = useCallback(
    (formData): void => {
      onSave(formData[POLICY_FIELD_NAME])
      onClose()
    },
    [onClose, onSave],
  )

  const formConfig = useMemo(
    (): {
      field: FormFieldInterface
    } => ({
      field: {
        type: FormFieldType.Select,
        label: t('bis/ues:actions.assignNetworkAccessPolicy.dialog.label'),
        name: POLICY_FIELD_NAME,
        options: policies,
      },
    }),
    [policies, t],
  )

  return useMemo(
    () => (
      <Dialog open={open} onClose={onClose}>
        <DialogChildren
          title={t('bis/ues:actions.assignNetworkAccessPolicy.dialog.title')}
          onClose={onClose}
          content={
            <Form
              fields={[formConfig.field]}
              onSubmit={onSubmit}
              onCancel={onClose}
              initialValues={{ [POLICY_FIELD_NAME]: '' }}
              submitButtonLabel={t('bis/shared:common.save')}
              cancelButtonLabel={t('bis/shared:common.cancel')}
            />
          }
        />
      </Dialog>
    ),
    [formConfig.field, onClose, onSubmit, open, t],
  )
}

export default AssignNetworkAccessPolicyDialog
