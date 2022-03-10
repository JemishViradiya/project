import './PartnerDetailsForm.scss'

import { Formik } from 'formik'
import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'

import Button from '../../../../../components/Button'
import CopyToClipboardButton from '../../../../../components/CopyToClipboardButton'
import SelectField from '../../../../../components/elements/SelectField'
import TextField from '../../../../../components/elements/TextField'
import OldCard from '../../../../../components/OldCard'
import { email, required } from '../../../../../services/validation/FieldLevelValidation'
import Validator from '../../../../../services/validation/validator-new'

const partnerTypeOptions = [
  {
    text: 'MSSP',
    value: 'MSSP',
  },
  {
    text: 'OEM',
    value: 'OEM',
  },
  {
    text: 'Technical Alliance',
    value: 'Technical Alliance',
  },
  {
    text: 'Multi-Tenant Enterprise',
    value: 'Multi-Tenant Enterprise',
  },
]

class PartnerDetailsForm extends Component {
  state = {
    edit: false,
    oldPartnerType: null,
    modalOpen: false,
    partnerInfoData: {},
  }

  _onEditClick = () => this.setState({ edit: true, oldPartnerType: this.props.data.partnerType })

  _onCancelClick = () => {
    this.setState({ edit: false })
    this.form.resetForm()
  }

  _onSaveClick = async values => {
    const modifiedValues = Object.assign({}, values)

    modifiedValues.oldBbCustomerId = this.props.data.bbCustomerId
    await this.props.submitCallback(modifiedValues)
    this.setState({ edit: false })
  }

  _checkPartnerEdit(values) {
    if (!isEmpty(values)) {
      if (this.state.oldPartnerType !== values.partnerType) {
        this.setState({
          modalOpen: true,
          partnerInfoData: values,
        })
      } else {
        this._onSaveClick(values)
      }
    }
  }

  _checkPartnerEditPermissions(partnerType) {
    return partnerType !== 'Cylance'
  }

  _modalSave = () => {
    this._modalClose()
    this._onSaveClick(this.state.partnerInfoData)
  }

  _modalClose = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const { flags, loading, data } = this.props
    const { edit } = this.state

    return [
      <Formik
        key="partner-details-form"
        enableReinitialize
        initialValues={{
          name: data.name,
          website: data.website,
          email: data.email,
          phone: data.phone,
          partnerType: data.partnerType,
          bbCustomerId: data.bbCustomerId,
        }}
        ref={node => {
          this.form = node
        }}
        validate={values => {
          let errors = {}

          errors = Validator.validate(values, {
            name: [required],
            partnerType: [required],
            email: [email],
          })

          const { bbCustomerId } = values

          if (flags.uesTenantProvisioning && data.bbCustomerId !== bbCustomerId) {
            if (!bbCustomerId) {
              errors.bbCustomerId = 'Required'
            } else if (/^\d+$/.test(bbCustomerId) === false) {
              errors.bbCustomerId = 'Must contain only digits'
            }
          }

          return errors
        }}
        onSubmit={values => this._checkPartnerEdit(values)}
        render={({ values, touched, errors, handleChange, handleBlur, submitForm, setFieldValue, setFieldTouched }) => (
          <div id="partner-details">
            <OldCard
              loading={loading}
              editable
              editCallback={this._onEditClick}
              cancelCallback={this._onCancelClick}
              saveCallback={submitForm}
              editMode={edit}
            >
              <form>
                <h3>Partner Info</h3>
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
                  edit={edit}
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
                  optionLabel={values.partnerType}
                  edit={edit && this._checkPartnerEditPermissions(values.partnerType)}
                />
                <hr />
                <div className="input-container formPartnerId">
                  <label htmlFor="copy-partner-id">
                    <strong>Partner ID</strong>
                  </label>
                  <p className="copyToClipBoardWrapper">
                    <span className="formPartnerIdText">{data.id}</span>
                    <CopyToClipboardButton id="copy-partner-id" value={data.id} width="16" height="16" />
                  </p>
                </div>
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
                  edit={edit}
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
                  edit={edit}
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
                  edit={edit}
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
                      edit={edit}
                    />
                  </React.Fragment>
                ) : null}
              </form>
            </OldCard>
          </div>
        )}
      />,
      <Modal open={this.state.modalOpen} dimmer="blurring" key="partner-type-modal">
        <Modal.Header>
          <h3> Partner Type Change Detected </h3>
        </Modal.Header>
        <Modal.Content>
          <p> Changing the partner type will modify tenant settings for that partner. </p>
          <p> Are you sure you still want to modify the partner type? </p>
        </Modal.Content>
        <Modal.Actions>
          <Button outlined id="cancel-leave" onClick={() => this._modalClose()}>
            No
          </Button>
          <Button id="leave" onClick={() => this._modalSave(this.state.partnerInfoData)}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>,
    ]
  }
}

export default withLDConsumer()(PartnerDetailsForm)
