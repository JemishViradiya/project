import 'react-toastify/dist/ReactToastify.css'
import './NotificationContainer.scss'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

const CloseButton = ({ closeToast }) => (
  <span className="close-toast" onClick={closeToast}>
    x
  </span>
)

class NotificationContainer extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      switch (this.props.type) {
        case 'error':
          this.showError(this.props.message)
          break
        case 'success':
          this.showSuccess(this.props.message)
          break
        case 'warning':
          this.showWarning(this.props.message)
          break
        default:
          this.showDefault(this.props.message)
          break
      }
    }
  }

  showError(message) {
    toast.error(message || 'An error has occurred.')
  }

  showSuccess(message) {
    toast.success(message || 'Success.')
  }

  showWarning(message) {
    toast.warn(message || 'Partially successful.')
  }

  showDefault(message) {
    toast(message)
  }

  render() {
    return (
      <ToastContainer
        autoClose={4000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
        closeButton={<CloseButton />}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    type: state.notification.type,
    message: state.notification.message,
    id: state.notification.id,
  }
}

export default connect(mapStateToProps)(NotificationContainer)
