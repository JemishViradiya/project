import { Formik } from 'formik'
import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import React, { Component } from 'react'

import Badge from '../../../../components/Badge'
import SelectField from '../../../../components/elements/SelectField'
import TextField from '../../../../components/elements/TextField'
import OldCard from '../../../../components/OldCard'
import Toggle from '../../../../components/Toggle'

const billingProviderOptionsNetsuite = [
  {
    text: 'Netsuite',
    value: 'netsuite',
  },
]

const billingModelOptions = [
  {
    text: 'Monthly High-Water Mark',
    value: 'monthlyHighWater',
  },
]

class PartnerBillingForm extends Component {
  state = {
    edit: false,
    preEditIsEnabled: false,
  }

  componentDidMount() {
    this.setState({ preEditIsEnabled: this.props.data.isEnabled })
  }

  _onEditClick = () => this.setState({ edit: true })

  _onCancelClick = () => {
    this.setState({ edit: false })
    this.props.onBillingToggle(this.state.preEditIsEnabled)
    this.form.resetForm()
  }

  _onSaveClick = async values => {
    await this.props.submitCallback(values)
    this.setState({ edit: false })
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render() {
    const { loading, data, billingEnabled, onBillingToggle } = this.props

    const { edit } = this.state
    let badge
    if (data) {
      badge = <Badge text={data.isEnabled ? 'ENABLED' : 'DISABLED'} color={data.isEnabled ? 'green' : 'grey'} />
    }
    return (
      <Formik
        enableReinitialize
        initialValues={{
          billingAccountId: data.billingAccountId,
          billingProvider: data.billingProvider,
          billingModel: data.billingModel,
          subscriptionId: data.subscriptionId,
          isEnabled: data.isEnabled,
        }}
        ref={node => {
          this.form = node
        }}
        validate={values => {
          const errors = {}
          if (billingEnabled && (values.billingAccountId === '' || values.billingAccountId === null)) {
            errors.billingAccountId = 'Required'
          } else if (values.subscriptionId.length > 0) {
            if (billingEnabled && /^\d+$/.test(values.subscriptionId) === false) {
              errors.subscriptionId = 'Must contain only digits'
            } else if (billingEnabled && values.subscriptionId.length > 9) {
              errors.subscriptionId = 'Must not exceed 9 digits in length'
            }
          }
          return errors
        }}
        onSubmit={values => this._onSaveClick(values)}
        render={({ values, touched, errors, handleChange, handleBlur, submitForm, setFieldValue, setFieldTouched }) => (
          <div id="partner-billing-details">
            <OldCard
              loading={loading}
              editable
              editCallback={this._onEditClick}
              cancelCallback={this._onCancelClick}
              saveCallback={submitForm}
              editMode={edit}
            >
              <form>
                <h3>Billing Info {this.state.edit ? null : badge}</h3>
                {this.state.edit && (
                  <div className="billing--toggle">
                    <Toggle checked={billingEnabled} onClick={() => onBillingToggle(!billingEnabled)} />
                    <div>
                      <h4>Partner Billing</h4>
                      <p>If enabled, this Partner will be billed based on configured billing options</p>
                    </div>
                  </div>
                )}
                <hr />
                <SelectField
                  name="billingProvider"
                  label="Billing Provider"
                  value={billingEnabled ? 'netsuite' : ''}
                  handleChange={setFieldValue}
                  handleBlur={setFieldTouched}
                  options={billingProviderOptionsNetsuite}
                  disabled
                  edit={this.state.edit}
                  optionLabel="Netsuite"
                />
                <hr />
                <SelectField
                  name="billingModel"
                  label="Billing Model"
                  value={billingEnabled ? 'monthlyHighWater' : ''}
                  handleChange={setFieldValue}
                  handleBlur={setFieldTouched}
                  options={billingModelOptions}
                  disabled
                  edit={this.state.edit}
                  optionLabel="Monthly High-Water Mark"
                />
                <div>
                  <hr />
                  <TextField
                    name="billingAccountId"
                    type="text"
                    label="Provider Account ID"
                    tabIndex="8" // eslint-disable-line jsx-a11y/tabindex-no-positive
                    value={billingEnabled ? values.billingAccountId : null}
                    error={touched.billingAccountId && errors.billingAccountId}
                    touched={touched.billingAccountId}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    disabled={!billingEnabled}
                    edit={this.state.edit}
                  />
                </div>
                <div>
                  <hr />
                  <TextField
                    name="subscriptionId"
                    type="text"
                    label="Subscription ID"
                    tabIndex="9" // eslint-disable-line jsx-a11y/tabindex-no-positive
                    value={billingEnabled ? values.subscriptionId : null}
                    error={touched.subscriptionId && errors.subscriptionId}
                    touched={touched.subscriptionId}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    disabled={!billingEnabled}
                    edit={this.state.edit}
                  />
                </div>
              </form>
            </OldCard>
          </div>
        )}
      />
    )
  }
}

export default withLDConsumer()(PartnerBillingForm)
