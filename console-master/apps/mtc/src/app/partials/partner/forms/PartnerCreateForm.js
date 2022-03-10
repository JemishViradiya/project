import { Formik } from 'formik'
import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SelectField from '../../../../components/elements/SelectField'
import TextField from '../../../../components/elements/TextField'
import MaterialCard from '../../../../components/MaterialCard'
import Toggle from '../../../../components/Toggle'
import { FORMS } from '../../../../constants/Forms'
import { toggleFormSubmit } from '../../../../redux/form/actions'
import { email, required } from '../../../../services/validation/FieldLevelValidation'
import Validator from '../../../../services/validation/validator-new'

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

const partnerTypeOptions = [
  {
    text: 'MSSP',
    value: 'mssp',
  },
  {
    text: 'OEM',
    value: 'oem',
  },
  {
    text: 'Technical Alliance',
    value: 'alliance',
  },
  {
    text: 'Multi-Tenant Enterprise',
    value: 'mtc',
  },
]

class PartnerCreateForm extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.toggleFormSubmit !== prevProps.toggleFormSubmit) {
      this.form.submitForm()
    }
  }

  render() {
    const { flags, submitCallback, billingEnabled, onBillingToggle } = this.props

    return (
      <Formik
        ref={node => {
          this.form = node
        }}
        enableReinitialize
        initialValues={{
          name: '',
          website: '',
          email: '',
          phone: '',
          partnerType: '',
          bbCustomerId: '',
          userFirstName: '',
          userLastName: '',
          userEmail: '',
          billingAccountId: '',
          billingProvider: '',
          billingModel: '',
          subscriptionId: '',
        }}
        validate={values => {
          let errors = {}
          errors = Validator.validate(values, {
            name: [required],
            partnerType: [required],
            email: [email],
            userFirstName: [required],
            userLastName: [required],
            userEmail: [required, email],
          })

          if (billingEnabled && (values.billingAccountId === '' || values.billingAccountId === null)) {
            errors.billingAccountId = 'Required'
          }

          if (values.subscriptionId.length > 0) {
            if (billingEnabled && /^\d+$/.test(values.subscriptionId) === false) {
              errors.subscriptionId = 'Must contain only digits'
            } else if (billingEnabled && values.subscriptionId.length > 9) {
              errors.subscriptionId = 'Must not exceed 9 digits in length'
            }
          }

          const { bbCustomerId } = values
          if (
            flags.uesTenantProvisioning &&
            /^\d+$/.test(bbCustomerId) === false &&
            bbCustomerId !== undefined &&
            bbCustomerId !== ''
          ) {
            errors.bbCustomerId = 'Must contain only digits'
          }

          return errors
        }}
        onSubmit={submitCallback}
        render={({ values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldTouched }) => (
          <div id="create-partner-form">
            <form>
              <MaterialCard id="partner-info">
                <h3>Enter Partner Info</h3>
                <TextField
                  name="name"
                  type="text"
                  label="Partner Name"
                  tabIndex="1" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.name}
                  error={touched.name && errors.name}
                  touched={touched.name}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <hr />
                <SelectField
                  name="partnerType"
                  label="Partner Type"
                  tabIndex="2" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.partnerType}
                  error={touched.partnerType && errors.partnerType}
                  touched={touched.partnerType}
                  handleChange={setFieldValue}
                  handleBlur={setFieldTouched}
                  options={partnerTypeOptions}
                />
                <hr />
                <TextField
                  name="email"
                  type="text"
                  label="E-mail"
                  tabIndex="3" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.email}
                  error={touched.email && errors.email}
                  touched={touched.email}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <hr />
                <TextField
                  name="phone"
                  type="text"
                  label="Phone"
                  tabIndex="4" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.phone}
                  error={touched.phone && errors.phone}
                  touched={touched.phone}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <hr />
                <TextField
                  name="website"
                  type="text"
                  label="Website"
                  tabIndex="5" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.website}
                  error={touched.website && errors.website}
                  touched={touched.website}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                {flags.uesTenantProvisioning ? (
                  <React.Fragment>
                    <hr />
                    <TextField
                      name="bbCustomerId"
                      type="text"
                      label="BlackBerry Customer Id"
                      tabIndex="5" // eslint-disable-line jsx-a11y/tabindex-no-positive
                      value={values.bbCustomerId}
                      error={touched.bbCustomerId && errors.bbCustomerId}
                      touched={touched.bbCustomerId}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </React.Fragment>
                ) : null}
              </MaterialCard>
              <MaterialCard id="parter-user">
                <h3>Add a Partner User</h3>
                <TextField
                  name="userFirstName"
                  type="text"
                  label="Partner User First Name"
                  tabIndex="6" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.userFirstName}
                  error={touched.userFirstName && errors.userFirstName}
                  touched={touched.userFirstName}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <hr />
                <TextField
                  name="userLastName"
                  type="text"
                  label="Partner User Last Name"
                  tabIndex="7" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.userLastName}
                  error={touched.userLastName && errors.userLastName}
                  touched={touched.userLastName}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <hr />
                <TextField
                  name="userEmail"
                  type="text"
                  label="Partner User Email"
                  tabIndex="8" // eslint-disable-line jsx-a11y/tabindex-no-positive
                  value={values.userEmail}
                  error={touched.userEmail && errors.userEmail}
                  touched={touched.userEmail}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </MaterialCard>
              <MaterialCard id="billing-settings">
                <h3>Configure Billing Settings</h3>
                <div className="billing--toggle">
                  <Toggle
                    checked={billingEnabled}
                    onClick={onBillingToggle}
                    tabIndex="8" // eslint-disable-line jsx-a11y/tabindex-no-positive
                    secondary
                  />
                  <div>
                    <h4>Partner Billing</h4>
                    <p>If enabled, this Partner will be billed based on configured billing options</p>
                  </div>
                </div>
                <hr />
                <SelectField
                  name="billingProvider"
                  label="Billing Provider"
                  value={billingEnabled ? 'netsuite' : ''}
                  handleChange={setFieldValue}
                  handleBlur={setFieldTouched}
                  options={billingProviderOptionsNetsuite}
                  disabled
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
                />
                <div>
                  <hr />
                  <TextField
                    name="billingAccountId"
                    type="text"
                    label="Provider Account ID"
                    tabIndex="9" // eslint-disable-line jsx-a11y/tabindex-no-positive
                    value={values.billingAccountId}
                    error={touched.billingAccountId && errors.billingAccountId}
                    touched={touched.billingAccountId}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    disabled={!billingEnabled}
                  />
                </div>
                <div>
                  <hr />
                  <TextField
                    name="subscriptionId"
                    type="text"
                    label="Subscription ID"
                    tabIndex="10" // eslint-disable-line jsx-a11y/tabindex-no-positive
                    value={billingEnabled ? values.subscriptionId : ''}
                    error={touched.subscriptionId && errors.subscriptionId}
                    touched={touched.subscriptionId}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    disabled={!billingEnabled}
                  />
                </div>
              </MaterialCard>
            </form>
          </div>
        )}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    toggleFormSubmit: state.forms[FORMS.CREATE_EDIT_PARTNER].submitState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleSubmit: toggleFormSubmit,
    },
    dispatch,
  )
}

export default withLDConsumer()(connect(mapStateToProps, mapDispatchToProps)(PartnerCreateForm))
