import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { shallowEqual } from 'react-redux'

import { ErrorMessage } from '@hookform/error-message'

import { FormHelperText } from '@material-ui/core'

import { useControlledDialog } from '@ues/behaviours'

import { ActionLabel } from '../../../../components/ActionType'
import { Button, LearnMore, Modal } from '../../../../shared'
import styles from './AssignActionModal.module.less'

const GRACE_PERIOD_MIN = 1
const GRACE_PERIOD_MAX = 480

const GRACE_PERIOD_WORKSPACE_TEXT = 'policies.details.gracePeriodLockWorkspaceTooltip'
const GRACE_PERIOD_DEVICE_TEXT = 'policies.details.gracePeriodLockDeviceTooltip'

export const PERIOD_EXCEEDED_ERROR_TEXT = 'policies.details.gracePeriodInvalid'
export const PERIOD_EMPTY_ERROR_TEXT = 'common.errorFieldRequired'

const AssignActionModal = memo(({ dialogId, message, onAssign, onCancel }) => {
  const { t } = useTranslation()
  const { open, onClose } = useControlledDialog({
    dialogId,
    onClose: onCancel,
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button color="primary" onClick={onAssign}>
            {t('policies.details.assignAction')}
          </Button>
        </>
      }
    >
      {message} <LearnMore />
    </Modal>
  )
})

const renderForm = ({ tooltipText, t, errors, inputRef, gracePeriod }) => {
  return (
    <form>
      <div className={styles.modalInput}>
        <label className={styles.inputLabel}>
          <div title={tooltipText}>{t('policies.details.gracePeriod')}</div>
          <input
            title={tooltipText}
            min={GRACE_PERIOD_MIN}
            max={GRACE_PERIOD_MAX}
            defaultValue={gracePeriod || '30'}
            type="number"
            name="gracePeriod"
            aria-label={t('policies.details.gracePeriodInputAriaLabel')}
            ref={inputRef}
          />
        </label>
        <ErrorMessage
          errors={errors}
          name="gracePeriod"
          as={
            <FormHelperText
              aria-label={t('policies.details.gracePeriodErrorAriaLabel')}
              className={styles.errorText}
              margin="dense"
              error
            />
          }
        />
      </div>
    </form>
  )
}

const ModalForm = memo(({ onAssign, errors, register, t, gracePeriod, ...rest }) => {
  const validatorObject = {
    required: t(PERIOD_EMPTY_ERROR_TEXT),
    pattern: {
      value: /^[\d]*$/,
      message: t(PERIOD_EXCEEDED_ERROR_TEXT),
    },
    min: {
      value: 1,
      message: t(PERIOD_EXCEEDED_ERROR_TEXT),
    },
    max: {
      value: 480,
      message: t(PERIOD_EXCEEDED_ERROR_TEXT),
    },
  }
  return renderForm({ errors, register, inputRef: register(validatorObject), t, gracePeriod, ...rest })
})

const LockActionModal = memo(({ dialogId, title, message, onAssign, onCancel, tooltipText, gracePeriod }) => {
  const { t } = useTranslation()
  const { handleSubmit, errors: tmpErrors, register, formState } = useForm({
    mode: 'onChange',
    defaultValues: { gracePeriod },
    criteriaMode: 'all',
  })
  const onSubmit = useCallback(
    event => {
      event.stopPropagation()
      handleSubmit(onAssign)(event)
    },
    [handleSubmit, onAssign],
  )
  const errorsRef = useRef()
  if (!shallowEqual(tmpErrors, errorsRef.current)) {
    errorsRef.current = { ...tmpErrors }
  }
  const { current: errors } = errorsRef
  const { open, onClose } = useControlledDialog({
    dialogId,
    onClose: onCancel,
  })

  const actions = useMemo(
    () => (
      <>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button color="primary" loading={formState.isSubmitting} disabled={!formState.isValid} onClick={onSubmit}>
          {t('policies.details.assignAction')}
        </Button>
      </>
    ),
    [formState.isSubmitting, formState.isValid, onClose, onSubmit, t],
  )
  return (
    <Modal open={open} onClose={onClose} title={title} actions={actions}>
      {message} <LearnMore />
      <ModalForm
        onAssign={onAssign}
        onCancel={onClose}
        tooltipText={tooltipText}
        t={t}
        errors={errors}
        register={register}
        gracePeriod={gracePeriod}
      />
    </Modal>
  )
})

AssignActionModal.propTypes = {
  dialogId: PropTypes.string,
  message: PropTypes.string.isRequired,
  onAssign: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

const BlockAllModal = memo(({ onAssign, onCancel, dialogId }) => {
  const { t } = useTranslation()

  return (
    <AssignActionModal
      dialogId={dialogId}
      onAssign={onAssign}
      onCancel={onCancel}
      message={t('policies.details.assignActionBlockAll')}
    />
  )
})

BlockAllModal.propTypes = {
  onAssign: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
}

BlockAllModal.displayName = 'BlockAllModal'

const BlockRequestingModal = memo(({ onAssign, onCancel, dialogId }) => {
  const { t } = useTranslation()

  return (
    <AssignActionModal
      dialogId={dialogId}
      onAssign={onAssign}
      onCancel={onCancel}
      message={t('policies.details.assignActionBlockRequsted')}
    />
  )
})
BlockRequestingModal.propTypes = {
  onAssign: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
}

BlockRequestingModal.displayName = 'BlockRequestingModal'

const LockWorkspaceModal = memo(({ onAssign, onCancel, dialogId, watch, register, errors, gracePeriod }) => {
  const { t } = useTranslation()

  return (
    <LockActionModal
      dialogId={dialogId}
      onAssign={onAssign}
      onCancel={onCancel}
      tooltipText={t(GRACE_PERIOD_WORKSPACE_TEXT)}
      title={t(ActionLabel.MdmLockWorkspace)}
      message={t('policies.details.gracePeriodLockWorkspace')}
      watch={watch}
      register={register}
      errors={errors}
      gracePeriod={gracePeriod}
    />
  )
})
LockWorkspaceModal.propTypes = {
  onAssign: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
}

const LockDeviceModal = memo(({ onAssign, onCancel, dialogId, watch, register, errors, gracePeriod }) => {
  const { t } = useTranslation()

  return (
    <LockActionModal
      dialogId={dialogId}
      onAssign={onAssign}
      onCancel={onCancel}
      tooltipText={t(GRACE_PERIOD_DEVICE_TEXT)}
      title={t(ActionLabel.MdmLockDevice)}
      message={t('policies.details.gracePeriodLockDevice')}
      watch={watch}
      register={register}
      errors={errors}
      gracePeriod={gracePeriod}
    />
  )
})
LockDeviceModal.propTypes = {
  onAssign: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
}

const DisableWorkspaceModal = memo(({ onAssign, onCancel, dialogId }) => {
  const { t } = useTranslation()

  return (
    <AssignActionModal
      dialogId={dialogId}
      onAssign={onAssign}
      onCancel={onCancel}
      message={t('policies.details.disableWorkspace')}
    />
  )
})

DisableWorkspaceModal.propTypes = {
  onAssign: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dialogId: PropTypes.string,
}

export { BlockAllModal, BlockRequestingModal, LockWorkspaceModal, LockDeviceModal, DisableWorkspaceModal }
