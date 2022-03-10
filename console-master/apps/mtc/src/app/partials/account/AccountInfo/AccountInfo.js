import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Badge from '../../../../components/Badge'
import CopyToClipboardButton from '../../../../components/CopyToClipboardButton'
import OldCard from '../../../../components/OldCard'
import PartnerUserList from '../../../../components/PartnerUserList/PartnerUserList'
import Storage from '../../../../Storage'
import {
  clearPartnerBillingInfo,
  clearPartnerDetails,
  getPartnerBillingInfo,
  getPartnerDetails,
  getPartnerUserList,
  setPartnerBillingInfo,
} from '../../partner/redux/actions'
// ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
// import { ToggleLoading } from '../../../../utils/decorators'
import AuthenticationSettings from '../forms/AuthenticationSettings'
import { clearSsoConfig, editSsoConfig, getSsoConfig } from '../redux/actions'

import('./AccountInfo.scss')

class AccountInfo extends Component {
  // Have to revert to constructor where I'm using decorators
  constructor(props) {
    super(props)
    this.state = {
      partnerId: null,
    }
    this._fetchBillingDetails = this._fetchBillingDetails.bind(this)
    this._fetchPartnerDetails = this._fetchPartnerDetails.bind(this)
    this._fetchPartnerUserList = this._fetchPartnerUserList.bind(this)
    this._fetchSsoConfig = this._fetchSsoConfig.bind(this)
  }

  componentDidMount() {
    const { pid } = Storage.getDecodedBearerToken()

    this.setState(
      {
        partnerId: pid,
      },
      () => {
        this._fetchPartnerUserList()
        this._fetchPartnerDetails()
        this._fetchBillingDetails()
        this._fetchSsoConfig()
      },
    )
  }

  componentWillUnmount() {
    // Prevent stale partner detail data
    this.props.clearPartnerDetails()
    this.props.clearPartnerBillingInfo()
    this.props.clearSsoConfig()
  }

  // ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
  // @ToggleLoading('partnerUsersLoading')
  async _fetchPartnerUserList() {
    await this.props.getPartnerUserList(this.state.partnerId)
  }

  // @ToggleLoading('partnerInfoLoading')
  async _fetchPartnerDetails() {
    await this.props.getPartnerDetails(this.state.partnerId)
  }

  // @ToggleLoading('billingInfoLoading')
  async _fetchBillingDetails() {
    await this.props.getPartnerBillingInfo(this.state.partnerId)
  }

  // @ToggleLoading('ssoConfigLoading')
  async _fetchSsoConfig() {
    await this.props.getSsoConfig(this.state.partnerId)
  }

  // @ToggleLoading('ssoConfigLoading')
  async _editSsoConfig(data) {
    const updatedSsoConfig = Object.assign({}, data, { partnerId: this.state.partnerId })
    await this.props.editSsoConfig(updatedSsoConfig)
  }

  render() {
    const {
      partnerInfoLoading,
      partnerInfoData,
      partnerUsersLoading,
      partnerUsersData,
      billingInfoLoading,
      billingInfoData,
      ssoConfigLoading,
      ssoConfig,
      userManagePermission,
    } = this.props
    let badge
    if (billingInfoData) {
      badge = (
        <Badge text={billingInfoData.isEnabled ? 'ENABLED' : 'DISABLED'} color={billingInfoData.isEnabled ? 'green' : 'grey'} />
      )
    }
    return (
      <div id="account-info">
        <OldCard loading={partnerInfoLoading}>
          <h3>Partner Info</h3>
          <hr />
          {partnerInfoData && (
            <div>
              <div className="list-row">
                <p>
                  <strong>Partner Name</strong>
                </p>
                <p>{partnerInfoData.name}</p>
              </div>
              <hr />
              <div className="list-row">
                <p>
                  <strong>Partner Type</strong>
                </p>
                <p>{partnerInfoData.partnerType ? partnerInfoData.partnerType : '—'}</p>
              </div>
              <hr />
              <div className="list-row partner-id">
                <p>
                  <strong>Partner ID</strong>
                </p>
                <p>
                  {this.state.partnerId ? this.state.partnerId : '—'}
                  {this.state.partnerId && <CopyToClipboardButton value={this.state.partnerId} width="16" height="16" />}
                </p>
              </div>
              <hr />
              <div className="list-row">
                <p>
                  <strong>Partner Email</strong>
                </p>
                <p>{partnerInfoData.email ? partnerInfoData.email : '—'}</p>
              </div>
              <hr />
              <div className="list-row">
                <p>
                  <strong>Partner Website</strong>
                </p>
                <p>{partnerInfoData.website ? partnerInfoData.website : '—'}</p>
              </div>
              <hr />
              <div className="list-row">
                <p>
                  <strong>Partner Phone</strong>
                </p>
                <p>{partnerInfoData.phone ? partnerInfoData.phone : '—'}</p>
              </div>
            </div>
          )}
        </OldCard>
        <AuthenticationSettings
          editable={userManagePermission}
          loading={ssoConfigLoading}
          data={ssoConfig}
          submitCallback={this._editSsoConfig.bind(this)}
        />
        <OldCard loading={billingInfoLoading}>
          <h3>Billing Info {badge}</h3>
          <hr />
          {billingInfoData && (
            <div>
              <div className="list-row">
                <p>
                  <strong>Billing Provider</strong>
                </p>
                <p>Netsuite</p>
              </div>
              <hr />
              <div className="list-row">
                <p>
                  <strong>Billing Model</strong>
                </p>
                <p>Monthly High-Water Mark</p>
              </div>
              <div>
                <hr />
                <div className="list-row">
                  <p>
                    <strong>Provider Account ID</strong>
                  </p>
                  <p>{billingInfoData.billingAccountId}</p>
                </div>
              </div>
              <div>
                <hr />
                <div className="list-row">
                  <p>
                    <strong>Subscription ID</strong>
                  </p>
                  <p>{billingInfoData.subscriptionId}</p>
                </div>
              </div>
            </div>
          )}
        </OldCard>
        <PartnerUserList loading={partnerUsersLoading} data={partnerUsersData} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    partnerUsersData: state.partners.partnerUserList,
    partnerInfoData: state.partners.partnerDetails,
    billingInfoData: state.partners.partnerBillingInfo,
    billingEnabled: state.partners.partnerBillingInfo.isEnabled,
    ssoConfig: state.account.ssoConfig,
    partnerUsersLoading: state.requests.inProcess['get-partner-user-list'],
    billingInfoLoading: state.requests.inProcess['get-partner-billing-info'],
    partnerInfoLoading: state.requests.inProcess['get-partner-details'],
    ssoConfigLoading: state.requests.inProcess['sso-config'],
    userManagePermission: !!state.auth.permissions['user:manage'],
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPartnerUserList: getPartnerUserList,
      getPartnerDetails: getPartnerDetails,
      clearPartnerDetails: clearPartnerDetails,
      getPartnerBillingInfo: getPartnerBillingInfo,
      clearPartnerBillingInfo: clearPartnerBillingInfo,
      setPartnerBillingInfo: setPartnerBillingInfo,
      getSsoConfig: getSsoConfig,
      editSsoConfig: editSsoConfig,
      clearSsoConfig: clearSsoConfig,
    },
    dispatch,
  )
}

export default withLDConsumer()(connect(mapStateToProps, mapDispatchToProps)(AccountInfo))
