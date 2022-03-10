import { validate } from './utils'

describe('General Info Utils Tests', () => {
  describe('validate', () => {
    it('requires a value', () => {
      expect(validate(undefined)).toEqual('policyNameRequired')
      expect(validate(null)).toEqual('policyNameRequired')
      expect(validate('')).toEqual('policyNameRequired')

      expect(validate('test')).toEqual(null)
    })
    it('checks for invalid characters', () => {
      expect(validate('&test')).toEqual('invalidCharactersInPolicyName')
      expect(validate('tes&t')).toEqual('invalidCharactersInPolicyName')
      expect(validate('test&')).toEqual('invalidCharactersInPolicyName')
      expect(validate('<test>')).toEqual('invalidCharactersInPolicyName')
      expect(validate('<t>es<t>')).toEqual('invalidCharactersInPolicyName')
      expect(validate('<t>est')).toEqual('invalidCharactersInPolicyName')
      expect(validate('t<e>st')).toEqual('invalidCharactersInPolicyName')
      expect(validate('te<s>t')).toEqual('invalidCharactersInPolicyName')
      expect(validate('tes<t>')).toEqual('invalidCharactersInPolicyName')
      expect(validate('<te>st')).toEqual('invalidCharactersInPolicyName')
      expect(validate('t<es>t')).toEqual('invalidCharactersInPolicyName')
      expect(validate('te<st>')).toEqual('invalidCharactersInPolicyName')
      expect(validate('t<est>')).toEqual('invalidCharactersInPolicyName')
      expect(validate('<tes>t')).toEqual('invalidCharactersInPolicyName')

      expect(validate('test 2')).toEqual(null)
      expect(validate('<test')).toEqual(null)
      expect(validate('te<st')).toEqual(null)
      expect(validate('test<')).toEqual(null)
      expect(validate('>test')).toEqual(null)
      expect(validate('t>est')).toEqual(null)
      expect(validate('test>')).toEqual(null)
    })
  })
})
