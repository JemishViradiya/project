import validator from 'validator'

class Validator {
  static validateRules(rules, value) {
    const allErrors = []
    rules.forEach(rule => {
      const error = this.validateRule(rule, value)
      if (error !== '') {
        allErrors.push(error)
      }
    })
    if (allErrors.length !== 0) {
      return allErrors.join('\n')
    } else {
      return ''
    }
  }

  static validateRule(rule, value) {
    switch (rule.type) {
      case 'isRequired':
        return !this.isRequired(value) ? 'Field is required.' : ''
      case 'isEmail':
        return !this.isEmail(value) ? 'Email is not valid.' : ''
      case 'possibleNull':
        return !this.possibleNull(value, rule.rule) ? `Value must be greater than ${rule.rule}` : ''
      case 'minNum':
        return !this.minNum(value, rule.rule) ? `Value must be greater than ${rule.rule}` : ''
      case 'isLength':
        return !this.isLength(value, rule.rule) ? `length should be exactly ${rule.rule}.` : ''
      case 'min':
        return !this.minLength(value, rule.rule) ? `Value must be at least ${rule.rule} in size.` : ''
      case 'max':
        return !this.maxLength(value, rule.rule) ? `Value must be no more than ${rule.rule} in size.` : ''
      case 'sha256':
        return !this.sha256(value, rule.rule) ? `Value must be ${rule.rule} characters and in hexadecimal format.` : ''
      case 'category':
        return !this.category(value) ? 'Field is required.' : ''
      case 'isCustomDomain':
        return !this.isCustomDomain(value, false)
          ? 'Value must contain only lowercase letters, digits and hyphens, and have no more than 200 characters.'
          : ''
      case 'isCustomDomainEdit':
        return !this.isCustomDomain(value, true)
          ? 'Value must contain only lowercase letters, digits and hyphens, and have between 1 and 200 characters.'
          : ''
      default:
        return ''
    }
  }

  static validateForm(formObj) {
    let noErrors = true
    const formObjCopy = formObj
    for (const field in formObj) {
      const { rules } = formObj[field]
      const value = `${formObj[field].value}`
      if (typeof rules !== 'undefined') {
        const validationResult = this.validateRules(rules, value)
        if (validationResult !== '') {
          noErrors = false
          formObjCopy[field].error = validationResult
        }
      }
    }
    if (noErrors) {
      return true
    } else {
      return formObjCopy
    }
  }

  static isEmail(value) {
    if (!validator.isEmpty(value)) {
      return validator.isEmail(value)
    }
    return true
  }

  static isLength(value, expectedLength) {
    return validator.isLength(value, expectedLength)
  }

  static minLength(value, expectedLength) {
    const options = {
      min: expectedLength,
      max: undefined,
    }
    return validator.isLength(value, options)
  }

  static possibleNull(value, minValue) {
    let condition = true
    if (value === undefined || (value === null && value === 'null' && value === '')) {
      return true
    } else if (value !== 'null' && value !== null && value !== '') {
      condition = value > minValue
    }
    return condition
  }

  static minNum(value, minValue) {
    let condition = true
    if (value !== 'null' && value !== null && value !== '') {
      condition = value > minValue
    }
    return condition
  }

  static maxNum(value, maxValue) {
    if (value !== null && value !== '') {
      return value < maxValue
    }
  }

  static maxLength(value, expectedLength) {
    const options = {
      min: 0,
      max: expectedLength,
    }
    return validator.isLength(value, options)
  }

  static isRequired(value) {
    if (value.constructor === Array) {
      return value.length > 0
    }
    if (typeof value === 'number') {
      return true
    }
    return !validator.isEmpty(value)
  }

  static sha256(value) {
    return value.match(/^[a-fA-F0-9]{64}$/) !== null
  }

  static category(value) {
    if (value.length > 0) {
      return true
    }
    return !validator.isEmpty(value)
  }

  static isCustomDomain(value, isEdit) {
    if (value === null || value === '') {
      return !isEdit
    } else if (!this.maxLength(value, 200)) {
      return false
    } else if (value.match(/^[a-z0-9-]*$/) === null) {
      return false
    }
    return true
  }
}

export default Validator
