class Validator {
  static validate(values, rules) {
    const errors = {}
    Object.keys(values).forEach(key => {
      if (typeof rules[key] !== 'undefined') {
        rules[key].forEach(rule => {
          if (typeof rule(values[key]) !== 'undefined') {
            if (typeof errors[key] === 'undefined') {
              errors[key] = ''
            }
            errors[key] += rule(values[key])
          }
        })
      }
    })
    return errors
  }
}

export default Validator
