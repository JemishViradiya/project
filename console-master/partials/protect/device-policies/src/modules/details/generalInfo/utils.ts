import cond from 'lodash/cond'
import isEmpty from 'lodash/isEmpty'

const validate = (value: string): string | null => {
  return cond([
    [() => isEmpty(value), () => 'policyNameRequired'],
    [() => /(<(.*)>)|&/.test(value), () => 'invalidCharactersInPolicyName'],
    [() => true, () => null],
  ])(undefined)
}

export { validate }
