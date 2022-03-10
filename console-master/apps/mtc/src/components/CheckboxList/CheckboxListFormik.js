import PropTypes from 'prop-types'
import React from 'react'

import FormikError from '../FormikError'
import CheckboxList from './CheckboxList'

const CheckboxListFormik = ({ options, values, error, handleChange, fieldId }) => (
  <div className="formik-field-container">
    <FormikError message={error} displayType="alert" />
    <CheckboxList options={options} selected={values} onChange={handleChange} fieldId={fieldId} />
  </div>
)

CheckboxListFormik.propTypes = {
  options: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))),
  values: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  handleChange: PropTypes.func,
  fieldId: PropTypes.string,
}

export default CheckboxListFormik
