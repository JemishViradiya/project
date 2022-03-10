import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FormSubmitHeader from '../../../../components/FormSubmitHeader'
import PageHeader from '../../../../components/PageHeader'
import SaveModal from '../../../../components/SaveModal/SaveModal'
import { FORMS } from '../../../../constants/Forms'
import { initializeForm, toggleFormLoading, toggleFormSubmit } from '../../../../redux/form/actions'
import PartnerCreateForm from '../forms/PartnerCreateForm'
import { createPartner } from '../redux/actions'

import('./PartnerCreate.scss')

class PartnerCreate extends Component {
  constructor(props) {
    props.initializeForm(FORMS.CREATE_EDIT_PARTNER)
    super(props)
    this.state = {
      modalOpen: false,
      billingEnabled: false,
    }
  }

  componentDidUpdate() {
    const toggleSubmitParams = { formId: FORMS.CREATE_EDIT_PARTNER, toggleState: false }
    if (!this.props.submissionInProcess) {
      this.props.toggleFormLoading(toggleSubmitParams)
      this.props.toggleFormSubmit(toggleSubmitParams)
    }
  }

  _openModal = () => {
    this.setState({
      modalOpen: true,
    })
  }

  _closeModal = () => {
    this.setState({
      modalOpen: false,
    })
  }

  _handleSubmit = values => {
    this.props.toggleFormLoading({ formId: FORMS.CREATE_EDIT_PARTNER, toggleState: true })
    const model = Object.assign({}, values)
    if (this.state.billingEnabled) {
      model.billingProvider = 'netsuite'
      model.billingModel = 'monthlyHighWater'
    }
    this.props.createPartner(model)
  }

  _toggleBilling = isChecked => {
    this.setState({
      billingEnabled: !isChecked,
    })
  }

  render() {
    return [
      <div>
        <Helmet key="metadata">
          <title>Partner Create</title>
        </Helmet>
        <div id="partner-create-container" key="partner-create">
          <SaveModal handleClose={this._closeModal} open={this.state.modalOpen} />
          <PageHeader>
            <FormSubmitHeader
              cancelCallback={this._openModal}
              text="Add New Partner"
              cancel
              finishText="Save & Finish"
              formType={FORMS.CREATE_EDIT_PARTNER}
            />
          </PageHeader>
          <PartnerCreateForm
            submitCallback={this._handleSubmit}
            billingEnabled={this.state.billingEnabled}
            onBillingToggle={() => this._toggleBilling(this.state.billingEnabled)}
          />
        </div>
      </div>,
    ]
  }
}

const mapStateToProps = state => {
  return {
    submissionInProcess: state.requests.inProcess['create-partner'],
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      initializeForm,
      toggleFormLoading,
      toggleFormSubmit,
      createPartner,
    },
    dispatch,
  )
}

export default withLDConsumer()(connect(mapStateToProps, mapDispatchToProps)(PartnerCreate))
