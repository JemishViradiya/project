import PropTypes from 'prop-types'
import React from 'react'

require('./FormikError.scss')

// displayType alert is similar to bootstrap alert
// displayType field displays the error underneath the form field

const FormikError = ({ message, displayType }) => (
  <div className={`formik-error ${displayType} ${message ? 'active' : ''}`}>
    <p>{message}</p>
  </div>
)

FormikError.propTypes = {
  message: PropTypes.string,
  displayType: PropTypes.oneOf(['alert', 'field']),
}

export default FormikError
