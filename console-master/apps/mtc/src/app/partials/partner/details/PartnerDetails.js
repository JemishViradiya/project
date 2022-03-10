import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PartnerUserList from '../../../../components/PartnerUserList/PartnerUserList'
import AuthenticationSettings from '../../account/forms/AuthenticationSettings'
import { clearSsoConfig, editSsoConfig, getSsoConfig } from '../../account/redux/actions'
// ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
// import { ToggleLoading } from '../../../../utils/decorators'
import PartnerBillingForm from '../forms/PartnerBillingForm'
import PartnerDetailsForm from '../forms/PartnerDetailsForm'
import {
  clearPartnerBillingInfo,
  clearPartnerDetails,
  editPartner,
  editPartnerBilling,
  getPartnerBillingInfo,
  getPartnerDetails,
  getPartnerUserList,
  setPartnerBillingInfo,
} from '../redux/actions'

import('./PartnerDetails.scss')

class PartnerDetails extends Component {
  componentDidMount() {
    this._fetchPartnerUserList()
    this._fetchPartnerInfo()
    this._fetchBillingInfo()
    this._fetchSsoConfig()
  }

  componentWillUnmount() {
    // Prevent stale partner detail data
    this.props.clearPartnerDetails()
    this.props.clearPartnerBillingInfo()
    this.props.clearSsoConfig()
  }

  // ToDo-Migration: plugin-proposal-decorators vs. Nx.dev/web
  // @ToggleLoading('partnerUserListLoading')
  async _fetchPartnerUserList() {
    await this.props.getPartnerUserList(this.props.match.params.partnerId)
  }

  // @ToggleLoading('partnerInfoLoading')
  async _fetchPartnerInfo() {
    await this.props.getPartnerDetails(this.props.match.params.partnerId)
  }

  // @ToggleLoading('billingInfoLoading')
  async _fetchBillingInfo() {
    await this.props.getPartnerBillingInfo(this.props.match.params.partnerId)
  }

  // @ToggleLoading('partnerInfoLoading')
  async _savePartnerInfo(data) {
    await this.props.editPartner(data, this.props.match.params.partnerId)
  }

  // @ToggleLoading('billingInfoLoading')
  async _saveBillingInfo(values) {
    if (!isEmpty(values)) {
      const { partnerId } = this.props.match.params
      const model = Object.assign({}, values)

      model.isEnabled = this.props.billingEnabled
      if (this.props.billingEnabled) {
        model.billingProvider = 'netsuite'
        model.billingModel = 'monthlyHighWater'
      } else {
        model.billingProvider = null
        model.billingModel = null
      }
      if (model.billingAccountId === null || model.billingAccountId) {
        await this.props.editPartnerBilling(model, partnerId)
      }
      this.props.setPartnerBillingInfo(model)
    }
  }

  // @ToggleLoading('ssoConfigLoading')
  async _fetchSsoConfig() {
    await this.props.getSsoConfig(this.props.match.params.partnerId)
  }

  // @ToggleLoading('ssoConfigLoading')
  async _editSsoConfig(data) {
    const updatedSsoConfig = Object.assign({}, data, { partnerId: this.props.match.params.partnerId })
    await this.props.editSsoConfig(updatedSsoConfig)
  }

  _toggleBilling(isChecked) {
    const model = Object.assign({}, this.props.billingInfoData)
    model.isEnabled = isChecked
    this.props.setPartnerBillingInfo(model)
  }

  render() {
    return [
      <Helmet key="metadata">
        <title>Partner Details</title>
      </Helmet>,
      <PartnerDetailsForm
        key="partner-details-form"
        loading={this.props.partnerInfoLoading}
        submitCallback={this._savePartnerInfo.bind(this)}
        data={this.props.partnerInfoData}
      />,
      <AuthenticationSettings
        editable
        key="partner-sso-config"
        loading={this.props.ssoConfigLoading}
        data={this.props.ssoConfig}
        submitCallback={this._editSsoConfig.bind(this)}
      />,
      <PartnerBillingForm
        key="partner-billing-form"
        loading={this.props.billingInfoLoading}
        submitCallback={this._saveBillingInfo.bind(this)}
        onBillingToggle={this._toggleBilling.bind(this)}
        billingEnabled={this.props.billingEnabled}
        data={this.props.billingInfoData}
      />,
      <PartnerUserList key="partner-user-list" loading={this.props.partnerUserListLoading} data={this.props.partnerUserListData} />,
    ]
  }
}

function mapStateToProps(state) {
  return {
    partnerUserListData: state.partners.partnerUserList,
    partnerInfoData: state.partners.partnerDetails,
    billingInfoData: state.partners.partnerBillingInfo,
    billingEnabled: state.partners.partnerBillingInfo.isEnabled,
    ssoConfig: state.account.ssoConfig,
    partnerUserListLoading: state.requests.inProcess['get-partner-user-list'],
    billingInfoLoading: state.requests.inProcess['get-partner-billing-info'],
    partnerInfoLoading: state.requests.inProcess['get-partner-details'],
    ssoConfigLoading: state.requests.inProcess['sso-config'],
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
      editPartner: editPartner,
      editPartnerBilling: editPartnerBilling,
      setPartnerBillingInfo: setPartnerBillingInfo,
      getSsoConfig: getSsoConfig,
      editSsoConfig: editSsoConfig,
      clearSsoConfig: clearSsoConfig,
    },
    dispatch,
  )
}

export default withLDConsumer()(connect(mapStateToProps, mapDispatchToProps)(PartnerDetails))
