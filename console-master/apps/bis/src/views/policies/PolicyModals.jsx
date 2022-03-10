import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ConfirmationModal, ConfirmationModalStyles as styles } from '../../shared'

const sanitizePolicyName = policy => {
  let safePolicy = policy
  if (policy.length > 200) {
    safePolicy = `${policy.substring(0, 100)}…${policy.substring(policy.length - 100)}`
  }
  return safePolicy
}

const appliedUsersText = (appliedUsers, t) => (appliedUsers ? `(${t('policies.confirmDeletePolicyAppliedList')})` : '')

const Question = memo(({ policies }) => {
  const { t } = useTranslation()

  if (policies.length === 1) {
    // prettier-ignore
    return (
      <Trans i18nKey="policies.confirmDeletePolicy">
        <span>
          Do you want to delete the <strong data-testid="policy-name">{{ policy: sanitizePolicyName(policies[0].name) }}</strong> policy? {{ applied: appliedUsersText(policies[0].appliedUsers, t) }}
        </span>
      </Trans>
    )
  }
  return (
    <div>
      <div>{t('policies.confirmDeletePolicies')}</div>
      <div role="list" className={styles.list}>
        {policies.map((policy, index) => (
          <div role="listitem" className={styles.item} key={index} data-testid="policy-item">
            <strong>{sanitizePolicyName(policy.name)}</strong> {appliedUsersText(policy.appliedUsers, t)}
          </div>
        ))}
      </div>
    </div>
  )
})

export const DeletionConfirmation = memo(({ dialogId, policies, onClose, onDelete, deleteInProgress }) => {
  const { t } = useTranslation()
  return (
    <ConfirmationModal
      dialogId={dialogId}
      cancelLabel={t('common.cancel')}
      confirmLabel={t('common.delete')}
      onClose={onClose}
      onConfirm={onDelete}
      confirmInProgress={deleteInProgress}
    >
      <Question policies={policies} />
    </ConfirmationModal>
  )
})

DeletionConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
  deleteInProgress: PropTypes.bool,
  policies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      appliedUsers: PropTypes.bool,
    }),
  ).isRequired,
}
DeletionConfirmation.displayName = 'DeletionConfirmation'
