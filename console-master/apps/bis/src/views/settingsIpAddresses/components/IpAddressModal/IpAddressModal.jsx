import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useFormButtons } from '@ues-bis/shared'
import { useControlledDialog } from '@ues/behaviours'

import { Button, Modal } from '../../../../shared'
import IpAddressModalInputs from './IpAddressModalInputs'

const TRUSTED_LABEL = 'settings.ipAddress.trustedLabel'
const TRUSTED_DESCRIPTION = 'settings.ipAddress.trustedDescription'

const UNTRUSTED_LABEL = 'settings.ipAddress.untrustedLabel'
const UNTRUSTED_DESCRIPTION = 'settings.ipAddress.untrustedDescription'

const IpAddressModal = memo(({ defaultValues, dialogId, canEdit, onClose, onSave, isBlacklist }) => {
  const { t } = useTranslation()

  const label = useMemo(() => (isBlacklist ? t(UNTRUSTED_LABEL) : t(TRUSTED_LABEL)), [isBlacklist, t])
  const description = useMemo(() => (isBlacklist ? t(UNTRUSTED_DESCRIPTION) : t(TRUSTED_DESCRIPTION)), [isBlacklist, t])

  const formMethods = useForm({
    mode: 'onSubmit',
    defaultValues: defaultValues,
    criteriaMode: 'all',
  })

  const {
    register,
    formState: { isSubmitting },
  } = formMethods

  const { submitDisabled, onSubmit } = useFormButtons(formMethods, isSubmitting, onSave)
  const { open, onClose: controlledOnClose } = useControlledDialog({
    dialogId,
    onClose,
  })

  return (
    <Modal
      open={open}
      onClose={controlledOnClose}
      title={label}
      actions={
        <>
          <Button onClick={controlledOnClose}>{t('common.cancel')}</Button>
          <Button.Confirmation loading={isSubmitting} disabled={submitDisabled || !canEdit} onClick={onSubmit}>
            {t('common.save')}
          </Button.Confirmation>
        </>
      }
    >
      <FormProvider {...formMethods}>
        <form noValidate>
          {description}
          <IpAddressModalInputs register={register} canEdit={canEdit} errors={formMethods.errors} />
        </form>
      </FormProvider>
    </Modal>
  )
})

IpAddressModal.displayName = 'IpAddressModal'

IpAddressModal.propTypes = {
  dialogId: PropTypes.string,
  canEdit: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  isBlacklist: PropTypes.bool,
  defaultValues: PropTypes.object,
}

export default IpAddressModal
