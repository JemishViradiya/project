import './AuthenticationSettings.scss'

import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import * as yup from 'yup'

import Badge from '../../../../components/Badge'
import SelectField from '../../../../components/elements/SelectField'
import TextField from '../../../../components/elements/TextField'
import TooltipIcon from '../../../../components/Icons/Tooltip'
import OldCard from '../../../../components/OldCard'
import TextareaField from '../../../../components/TextareaField'
import Toggle from '../../../../components/Toggle'

const providerOptions = [
  { text: 'Azure', value: 'Azure' },
  { text: 'Okta', value: 'Okta' },
  { text: 'OneLogin', value: 'OneLogin' },
  { text: 'PingOne', value: 'PingOne' },
  { text: 'Custom', value: 'Custom' },
]

const SsoConfigSchema = yup.object().shape({
  provider: yup.string().required('Provider is required.'),
  x509Certificate: yup.string().required('X.509 Certificate is required.'),
  loginUrl: yup.string().url('Login URL must be a valid URL.').required('Login URL is required.'),
})

class AuthenticationSettings extends Component {
  state = {
    edit: false,
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      this.form.resetForm()
    }
  }

  _onEditClick = () => this.setState({ edit: true })

  _onCancelClick = () => {
    this.setState({ edit: false })
    this.form.resetForm()
  }

  _submitForm = async values => {
    await this.props.submitCallback(values)
    this.setState({ edit: false })
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  render() {
    const { loading, data, editable } = this.props
    const { edit } = this.state
    let badge
    let login

    if (data) {
      badge = <Badge text={data.isEnabled ? 'ENABLED' : 'DISABLED'} color={data.isEnabled ? 'green' : 'grey'} />
      login = <Badge text={data.allowPasswordLogin ? 'ENABLED' : 'DISABLED'} color={data.allowPasswordLogin ? 'green' : 'grey'} />
    }

    const boldToolTip = {
      fontStyle: 'italic',
    }

    const initialValues = {
      allowPasswordLogin: data.allowPasswordLogin,
      isEnabled: data.isEnabled,
      provider: data.provider || '',
      x509Certificate: data.x509Certificate || '',
      x509CertificateFingerprint: data.x509CertificateFingerprint,
      loginUrl: data.loginUrl || '',
    }

    return (
      <>
        <Formik
          key="authentication-settings-form"
          enableReinitialize
          initialValues={initialValues}
          ref={node => {
            this.form = node
          }}
          validationSchema={SsoConfigSchema}
          onSubmit={values => this._submitForm(values)}
          render={({ values, touched, errors, handleChange, handleBlur, submitForm, setFieldValue, setFieldTouched }) => (
            <div id="authentication-settings" className={edit ? 'edit' : ''}>
              <OldCard
                loading={loading}
                editable={editable}
                editCallback={this._onEditClick}
                cancelCallback={this._onCancelClick}
                saveCallback={submitForm}
                editMode={edit}
                dimmed={loading}
              >
                <Form>
                  <h3>Authentication Settings</h3>
                  <hr />
                  {edit ? (
                    <div className="sso-enabled--toggle">
                      <Toggle
                        checked={values.isEnabled}
                        onClick={() => setFieldValue('isEnabled', !values.isEnabled)}
                        label="Enable SSO"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="input-container">
                        <p>
                          <strong>SSO</strong>
                        </p>
                        <div>{badge}</div>
                      </div>
                    </div>
                  )}
                  <div className={`sso-enabled-config--${values.isEnabled ? 'show' : 'hide'}`}>
                    <hr />
                    <SelectField
                      name="provider"
                      label="Provider"
                      value={values.provider}
                      optionLabel={values.provider}
                      handleChange={setFieldValue}
                      handleBlur={setFieldTouched}
                      options={providerOptions}
                      edit={edit}
                      touched={touched.provider}
                      error={touched.provider && errors.provider}
                    />
                    <hr />
                    {edit ? (
                      <TextareaField
                        name="x509Certificate"
                        label="X.509 Certificate"
                        tabIndex="3" //eslint-disable-line jsx-a11y/tabindex-no-positive
                        value={values.x509Certificate}
                        error={touched.x509Certificate && errors.x509Certificate}
                        touched={touched.x509Certificate}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        edit={edit}
                      />
                    ) : (
                      <div className="list-row x509-cert">
                        <p>
                          <strong>X.509 Certificate</strong>
                        </p>
                        <p className="x509-cert__value">{data.x509CertificateFingerprint}</p>
                      </div>
                    )}
                    <hr />
                    {edit ? (
                      <TextField
                        name="loginUrl"
                        label="Login URL"
                        tabIndex="4" //eslint-disable-line jsx-a11y/tabindex-no-positive
                        type="text"
                        value={values.loginUrl}
                        error={touched.loginUrl && errors.loginUrl}
                        touched={touched.loginUrl}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        edit={edit}
                        className="login-url"
                      />
                    ) : (
                      <div className="list-row x509-cert">
                        <p>
                          <strong>Login URL</strong>
                        </p>
                        <p className="login-url__value">{values.loginUrl}</p>
                      </div>
                    )}
                    <hr />
                    {edit ? (
                      <div className="password-login--toggle">
                        <Toggle
                          checked={values.allowPasswordLogin}
                          onClick={() => setFieldValue('allowPasswordLogin', !values.allowPasswordLogin)}
                          label="Password Login"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="input-container">
                          <p>
                            <strong>Password Login</strong>
                          </p>
                          <div>
                            {login}
                            <TooltipIcon
                              text={
                                <>
                                  <div>
                                    Disabling this setting will prevent all users in your organization from logging in the
                                    Multi-Tenant Console using their email and password.
                                  </div>
                                  <div style={boldToolTip}>
                                    Note: We recommend first configuring SSO with this option enabled and only disabling it after
                                    you have verified logging in successfully through SSO.
                                  </div>
                                </>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Form>
              </OldCard>
            </div>
          )}
        />
      </>
    )
  }
}

export default AuthenticationSettings
