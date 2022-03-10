/* eslint-disable jsx-a11y/tabindex-no-positive */

import { Formik } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'

import RegionSelectField from '../../../../../../../components/elements/RegionSelectField'
import TextField from '../../../../../../../components/elements/TextField'
import { email, required } from '../../../../../../../services/validation/FieldLevelValidation'
import Validator from '../../../../../../../services/validation/validator-new'

const LoginForm = props => (
  <Formik
    initialValues={{
      email: '',
      password: '',
      region: props.region,
    }}
    validate={values => {
      return Validator.validate(values, {
        email: [required, email],
        password: [required],
        region: [required],
      })
    }}
    onSubmit={props.onSubmit}
    render={({
      values,
      touched,
      errors,
      isSubmitting,
      handleSubmit,
      handleChange,
      handleBlur,
      dirty,
      setFieldValue,
      setFieldTouched,
    }) => (
      <form onSubmit={handleSubmit} className="external-page-content-container">
        <Dimmer active={props.loading} inverted>
          <Loader inverted content="Authenticating" />
        </Dimmer>
        <h1>Multi-Tenant Console Sign-In</h1>
        <TextField
          name="email"
          type="text"
          label="Email"
          placeholder="john.doe@email.com"
          tabIndex="1"
          value={values.email}
          error={touched.email && errors.email}
          touched={touched.email}
          handleChange={handleChange}
          handleBlur={handleBlur}
          testid="login-email-input"
        />
        <Link
          testid="login-form-link-forgot-passsword"
          id="login-form-link-forgot-passsword"
          to="/auth/forgot-password"
          className="forgot-password"
        >
          Forgot password?
        </Link>
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          tabIndex="2"
          value={values.password}
          error={touched.password && errors.password}
          touched={touched.password}
          handleChange={handleChange}
          handleBlur={handleBlur}
          testid="login-password-input"
        />
        <RegionSelectField
          tabIndex="3"
          value={values.region}
          error={errors.region}
          touched={touched.region}
          handleChange={setFieldValue}
          handleBlur={setFieldTouched}
          mockModeAvailable={props.environment === 'development' || props.environment === 'staging'}
          testid="login-region-select"
        />
        <div>
          <input
            tabIndex="4"
            type="submit"
            id="login-form-submit"
            data-testid="login-form-submit"
            value="Sign In"
            disabled={!dirty || isSubmitting}
          />
        </div>
        <div className="external-login">
          <Link to="/auth/external-login" data-testid="external-login">
            Sign in with your external account
          </Link>
        </div>
      </form>
    )}
  />
)

export default LoginForm
