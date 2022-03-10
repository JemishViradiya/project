/* eslint-disable jsx-a11y/tabindex-no-positive */

import { Formik } from 'formik'
import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

import RegionSelectField from '../../../../../../../components/elements/RegionSelectField'
import TextField from '../../../../../../../components/elements/TextField'
import { email, required } from '../../../../../../../services/validation/FieldLevelValidation'
import Validator from '../../../../../../../services/validation/validator-new'

const ForgotPasswordForm = props => (
  <Formik
    initialValues={{
      email: '',
      region: '',
    }}
    validate={values => {
      return Validator.validate(values, {
        email: [required, email],
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
          <Loader inverted content="Loading" />
        </Dimmer>
        <h1>Forgot Password?</h1>
        <p>Enter the email related to your account, and we’ll send you a reset link.</p>
        <TextField
          name="email"
          type="email"
          label="Email"
          placeholder="Email"
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
        />
        <div>
          <input
            tabIndex="3"
            type="submit"
            id="forgot-password-form-submit"
            value="Send Reset Link"
            disabled={!dirty || isSubmitting}
          />
        </div>
      </form>
    )}
  />
)

export default ForgotPasswordForm
