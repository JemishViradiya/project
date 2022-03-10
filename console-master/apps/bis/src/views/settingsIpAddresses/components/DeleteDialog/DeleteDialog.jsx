import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationModal, ConfirmationModalStyles as styles } from '../../../../shared'

const DeleteDialog = memo(({ dialogId, deleteInProgress, ipAddresses = [], onClose, onDelete }) => {
  const { t } = useTranslation()
  return (
    <ConfirmationModal
      dialogId={dialogId}
      confirmInProgress={deleteInProgress}
      cancelLabel={t('common.cancel')}
      confirmLabel={t('common.delete')}
      onClose={onClose}
      onConfirm={onDelete}
    >
      <div>{t('settings.ipAddress.confirmDelete')}</div>
      <div role="list" className={styles.list}>
        {ipAddresses.map((ipAddress, index) => (
          <div role="listitem" className={styles.item} key={index}>
            <strong>{ipAddress.name}</strong>
          </div>
        ))}
      </div>
    </ConfirmationModal>
  )
})

DeleteDialog.displayName = 'DeleteDialog'

DeleteDialog.protoTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
  ipAddresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
}

export default DeleteDialog
