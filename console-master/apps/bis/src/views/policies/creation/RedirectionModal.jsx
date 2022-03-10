import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationModal } from '../../../shared'

const RedirectionModal = memo(({ dialogId, onClose, onRedirect }) => {
  const { t } = useTranslation()
  return (
    <ConfirmationModal
      dialogId={dialogId}
      cancelLabel={t('policies.create.successReject')}
      confirmLabel={t('policies.create.successAccept')}
      onClose={onClose}
      onConfirm={onRedirect}
      title={t('policies.create.successTitle')}
    >
      {t('policies.create.successDescription')}
    </ConfirmationModal>
  )
})

RedirectionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRedirect: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
}
RedirectionModal.displayName = 'RedirectionModal'

export default RedirectionModal
