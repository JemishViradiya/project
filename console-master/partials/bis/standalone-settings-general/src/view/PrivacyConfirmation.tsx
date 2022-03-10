import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'

import { Modal } from '@ues-bis/shared'
import { useControlledDialog } from '@ues/behaviours'

interface PrivacyConfirmation {
  dialogId: symbol
  closePopup: () => void
  disable: () => void
}

const PrivacyConfirmation = memo(({ dialogId, closePopup, disable }: PrivacyConfirmation) => {
  const [agree, setAgree] = useState(false)
  const { t } = useTranslation()

  const onClose = useCallback(() => {
    setAgree(false)
    closePopup()
  }, [closePopup])

  const onConfirm = useCallback(() => {
    disable()
    onClose()
  }, [disable, onClose])

  const { open, onClose: controlledOnClose } = useControlledDialog({
    dialogId,
    onClose,
  })

  return (
    <Modal
      open={open}
      onClose={controlledOnClose}
      title={t('settings.privacy.confirmDisablePrivacyTitle')}
      actions={
        <>
          <Button onClick={controlledOnClose}>{t('common.cancel')}</Button>
          <Button disabled={!agree} onClick={onConfirm}>
            {t('settings.privacy.disable')}
          </Button>
        </>
      }
    >
      <Typography gutterBottom>{t('settings.privacy.confirmDisablePrivacyNote')}</Typography>
      <FormControlLabel
        control={<Checkbox checked={agree} size="small" onChange={e => setAgree(e.target.checked)} name="agree" />}
        label={t('settings.privacy.confirmDisablePrivacyAgree')}
      />
    </Modal>
  )
})

PrivacyConfirmation.displayName = 'PrivacyConfirmation'
export default PrivacyConfirmation
