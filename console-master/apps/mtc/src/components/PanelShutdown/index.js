import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'

import { DATEFORMAT } from '../../constants/DateFormat'
import { TenantAPI } from '../../services/api/tenantAPI'
import ErrorService from '../../services/errors'
import SuccessService from '../../services/success'
import Storage from '../../Storage'
import Button from '../Button'
import MSSPModal from '../MSSPModal'

require('./PanelShutdown.scss')

class ShutdownPanel extends Component {
  state = {
    id: null,
    loading: true,
    modalOpen: false,
  }

  componentDidMount() {
    this.setState({ id: this.props.data.id, loading: false })
  }
  cancelShutdown = () => {
    this.setState({ loading: true, modalOpen: false })
    TenantAPI.cancelShutdown(this.state.id)
      .then(() => {
        SuccessService.resolve('Tenant Shutdown Canceled')
        this.props.updateShutdownCallback(this.state.id)
      })
      .catch(error => {
        ErrorService.resolve(error)
        this.setState({ loading: false })
      })
  }

  openModal = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const { data, id } = this.props
    return (
      <div className="shutdown-panel" id={`shutdown-panel-${id}`}>
        <Dimmer active={this.state.loading} inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
        <div id="shutdown-tenant-info">
          <p id="shutdown-tenant-name">
            <Link to={`/tenant/details/${data.id}`}>
              <strong>{data.name}</strong>
            </Link>
          </p>
          <p id="grace-period-date">
            Tenant will be deleted on {moment(data.shutdownDate).format(DATEFORMAT.DATE)} at 11:59 PM UTC
          </p>
        </div>
        {Storage.checkPermission('tenant:shutdown') && (
          <div id="shutdown-button">
            <Button onClick={this.openModal}>Cancel Shutdown</Button>
            {/* <button onClick={this.openModal}>Cancel Shutdown</button> */}
          </div>
        )}
        <MSSPModal
          id="tenant-shutdown-modal"
          header="Shutdown Cancellation"
          modalOpen={this.state.modalOpen}
          cancelText="Resume Shutdown"
          confirmText="Cancel Shutdown"
          cancelModal={this.closeModal}
          confirmModal={this.cancelShutdown}
        >
          <p>
            You are about to cancel the scheduled shutdown for <strong>{data.name}</strong>. Are you sure you want to continue?
          </p>
        </MSSPModal>
      </div>
    )
  }
}

ShutdownPanel.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    protectLicensesAllocated: PropTypes.number,
    shutdownDate: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  updateShutdownCallback: PropTypes.func.isRequired,
}

export default ShutdownPanel
