/* eslint-disable jsx-a11y/tabindex-no-positive */

import './ExternalLoginForm.scss'

import { Formik } from 'formik'
import React from 'react'
import { Link } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'
import * as yup from 'yup'

import RegionSelectField from '../../../../../../components/elements/RegionSelectField'
import TextField from '../../../../../../components/elements/TextField'

const externalLoginSchema = yup.object().shape({
  email: yup.string().email('Email must be a valid email.').required('Email is required.'),
  region: yup.string().required(),
})

const LoginForm = props => (
  <Formik
    initialValues={{
      email: '',
      region: props.region,
    }}
    validationSchema={externalLoginSchema}
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
      <form id="external-login-form" onSubmit={handleSubmit} className="external-page-content-container">
        <Dimmer active={props.loading} inverted>
          <Loader inverted content="Authenticating" />
        </Dimmer>
        <h1>Multi-Tenant Console Sign-In</h1>
        <h4 className="form-subtitle">External Identity Provider Login</h4>
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
        />
        <RegionSelectField
          tabIndex="2"
          value={values.region}
          error={errors.region}
          touched={touched.region}
          handleChange={setFieldValue}
          handleBlur={setFieldTouched}
          mockModeAvailable={props.environment === 'development' || props.environment === 'staging'}
        />
        <div>
          <input tabIndex="4" type="submit" id="login-form-submit" value="Sign In" disabled={!dirty || isSubmitting} />
        </div>
        <div className="external-login">
          <Link to="/auth/login">Sign in with your Cylance account</Link>
        </div>
      </form>
    )}
  />
)

export default LoginForm
