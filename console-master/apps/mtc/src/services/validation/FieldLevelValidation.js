import validator from 'validator'

const required = value => {
  if (Array.isArray(value)) {
    return value.length >= 1 ? undefined : 'Field is required'
  } else {
    return value ? undefined : 'Field is required.'
  }
}
const email = email => (email && !validator.isEmail(email) ? 'Invalid email address' : undefined)

export { required, email }
