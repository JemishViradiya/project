import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationModal } from '../../shared'

export const DeleteAppliedModal = memo(({ dialogId, data, onClose, onDelete, policyName, deleteInProgress }) => {
  const { t } = useTranslation()
  const translationParams = useMemo(() => {
    const { users, groups } = data
    return { users: users.length, groups: groups.length, policyName }
  }, [data, policyName])
  return (
    <ConfirmationModal
      dialogId={dialogId}
      confirmInProgress={deleteInProgress}
      cancelLabel={t('common.cancel')}
      confirmLabel={t('common.remove')}
      onClose={onClose}
      onConfirm={onDelete}
    >
      {t('policies.details.deleteAppliedConfirm', translationParams)}
    </ConfirmationModal>
  )
})
DeleteAppliedModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  data: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.object),
    groups: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  policyName: PropTypes.string.isRequired,
  dialogId: PropTypes.string,
}

DeleteAppliedModal.defaultProps = {
  policyName: '',
}

DeleteAppliedModal.displayName = 'DeleteAppliedModal'
