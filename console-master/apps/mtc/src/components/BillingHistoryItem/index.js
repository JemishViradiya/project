import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import moment from 'moment'
import React from 'react'

require('./BillingHistoryItem.scss')

const CSVButton = props => {
  const { id, onClickCallback, loading, reportName } = props

  const onClick = () => {
    if (!loading) {
      onClickCallback(id, reportName)
    }
  }

  return (
    <button onClick={onClick} className={loading ? 'loading' : ''}>
      <span className="icon-download" />
      <p>{loading ? 'Downloading...' : 'Download CSV'}</p>
    </button>
  )
}

class BillingHistoryItem extends React.Component {
  state = {
    loading: false,
  }

  onClick = (id, reportName) => {
    this.setState({ loading: true })
    this.props.csvCallback(id, reportName, () => {
      this.setState({ loading: false })
    })
  }

  render() {
    const { data } = this.props
    const { mtcBilling, uesTenantProvisioning } = this.props.flags
    const hasProtectMobile = mtcBilling.protectMobile.enabled && uesTenantProvisioning
    const hasPersona = mtcBilling.persona.enabled
    const hasPersonaMobile = hasPersona && mtcBilling.personaMobile.enabled && uesTenantProvisioning
    const hasGateway = mtcBilling.blackBerryGateway.enabled && uesTenantProvisioning
    const hasDLP = mtcBilling.dataLossPrevention.enabled && uesTenantProvisioning

    return (
      <div className="billing-history-list-item">
        <div className="file-name">
          <div>
            <p>
              <strong>{data.reportFileName}</strong>
            </p>
            <p>Generated {moment(data.reportDate).format('LL')}</p>
          </div>
        </div>
        <div className="report-data-section">
          <div className="report-data">
            <div>
              <p>
                <strong>CylancePROTECT Usage</strong>
              </p>
              <p>{data.protectCount} devices</p>
            </div>
            {hasProtectMobile && (
              <div>
                <p>
                  <strong>Protect Mobile Usage</strong>
                </p>
                <p>{data.mtdCount} devices</p>
              </div>
            )}
            <div>
              <p>
                <strong>CylanceOPTICS Usage</strong>
              </p>
              <p>{data.opticsCount} devices</p>
            </div>
            {hasPersona && (
              <div>
                <p>
                  <strong>Persona Usage</strong>
                </p>
                <p>{data.personaCount} devices</p>
              </div>
            )}
            {hasPersonaMobile && (
              <div>
                <p>
                  <strong>Persona Mobile Usage</strong>
                </p>
                <p>{data.sisCount} devices</p>
              </div>
            )}
            {hasGateway && (
              <div>
                <p>
                  <strong>Gateway Usage</strong>
                </p>
                <p>{data.gatewayCount} users</p>
              </div>
            )}
            {hasDLP && (
              <div>
                <p>
                  <strong>Avert Usage</strong>
                </p>
                <p>{data.dlpCount} users</p>
              </div>
            )}
          </div>
        </div>
        <div className="report-button">
          <div>
            <CSVButton onClickCallback={this.onClick} id={data.id} reportName={data.reportFileName} loading={this.state.loading} />
          </div>
        </div>
      </div>
    )
  }
}

export default withLDConsumer()(BillingHistoryItem)
