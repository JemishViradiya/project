import { I } from '@ues-behaviour/shared-e2e'

export const TranslationKeys = {
  addNewPolicyButton: 'profiles:policy.list.add',
  automaticRiskReductionTitle: 'bis/ues:detectionPolicies.arr.title',
}

export const getAddNewPolicyButton = () => {
  return I.findByRole('button', { name: I.translate(TranslationKeys.addNewPolicyButton) })
}

export const getARRTitle = () => {
  return I.findByText(I.translate(TranslationKeys.automaticRiskReductionTitle))
}

export const verifyHashEquals = hash => {
  I.location().should(loc => {
    expect(loc.hash).to.eq(hash)
  })
}
