import PropTypes from 'prop-types'
import React from 'react'

import Button from '../Button'

const ModalActions = ({
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
  loading,
  confirmDisabled,
  children,
  cancelId,
  confirmId,
}) => (
  <div className="modal-actions">
    {children
      ? React.cloneElement(children, { onCancel, onConfirm, loading })
      : [
          <Button className="cancel-button" key="modal-btn-1" outlined onClick={onCancel} disabled={loading} id={cancelId}>
            {cancelText || 'Cancel'}
          </Button>,
          <Button key="modal-btn-2" onClick={onConfirm} disabled={confirmDisabled || loading} id={confirmId}>
            {confirmText || 'Confirm'}
          </Button>,
        ]}
  </div>
)

ModalActions.propTypes = {
  /** If children are supplied then confirm and cancel buttons will not render,
   * but confirm and cancel handlers will be passed to children
   */
  children: PropTypes.element,
  /** Overloads the default confirmation text */
  confirmText: PropTypes.string,
  /** Overloads the default cancel text */
  cancelText: PropTypes.string,
  /** Handler for cancel event */
  onCancel: PropTypes.func.isRequired,
  /** Handler for confirm event */
  onConfirm: PropTypes.func.isRequired,
}

ModalActions.defaultProps = {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
}

export default ModalActions
