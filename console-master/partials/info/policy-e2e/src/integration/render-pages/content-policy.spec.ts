import { CONDITIONS } from '../../support/constants/conditions'
import { FLAGS } from '../../support/constants/selectors'
import { HeaderPanel } from '../../support/pages/header-panel.page'
import { NavigationPanel } from '../../support/pages/navigation-panel.page'
import { ContentPolicy } from '../../support/pages/policies-pages/content-policy.page'
import { Helper } from '../../support/utils/helper'

const policy = `${FLAGS.DLP_POLICY}:policy`
const general = `${policy}.sections.general`

const testDefaultData = {
  policyName: 'Test Policy name',
  policyDescription: 'Test Policy description',
}

describe('Verifying all components and elements on Policy Page.', () => {
  describe('Verifying display Navigation and Header elements.', () => {
    before(() => {
      Helper.initializeBrowserFeatures()
      I.loadI18nNamespaces(FLAGS.DLP_POLICY, 'components')
      ContentPolicy.visit()
    })
    it('Verifying displays navigation.', () => {
      NavigationPanel.getNavigation().should(CONDITIONS.BE_VISIBLE)
    })
    it('Verifying the presence and correctness of the heading in the header.', () => {
      HeaderPanel.getHeadingByName(I.translate(`${policy}.addPolicyWithType`, { policyType: 'content' })).should(
        CONDITIONS.BE_VISIBLE,
      )
    })
    it('Verifying the presence and interactions button "Go Back".', () => {
      HeaderPanel.getButtonByLabel(I.translate('components:button.goBackText')).should(CONDITIONS.BE_VISIBLE).click()
      I.location().should(loc => expect(loc.hash).to.eq('#/policies/content'))
    })
  })
  describe('Verifying all components and elements on "General information" section.', () => {
    before(() => {
      Helper.initializeBrowserFeatures()
      I.loadI18nNamespaces(FLAGS.DLP_POLICY, 'components')
      ContentPolicy.visit()
    })
    it('Verifying heading of "General information" section.', () => {
      ContentPolicy.getHeadingByName(`${general}.title`).should(CONDITIONS.BE_VISIBLE)
    })
    it('Verifying "Policy name" field. Should be a required field. Checking the display of required field error.', () => {
      ContentPolicy.getPolicyNameField().should(CONDITIONS.HAVE_ATTRIBUTE, 'required')
      ContentPolicy.getPolicyNameField().focus()
      ContentPolicy.getPolicyDescriptionField().focus()
      ContentPolicy.getPolicyNameField()
        .parent()
        .next()
        .should(CONDITIONS.HAVE_TEXT, I.translate(`${ContentPolicy.FLAGS.SECTIONS}.requiredInput`))
      ContentPolicy.getPolicyNameField()
        .type(testDefaultData.policyName)
        .then(field => expect(field.val()).to.equal(testDefaultData.policyName))
    })
    it('Verifying "Description" field.', () => {
      ContentPolicy.getPolicyDescriptionField()
        .type(testDefaultData.policyDescription)
        .then(field => expect(field.val()).to.equal(testDefaultData.policyDescription))
    })
    it('Verifying dropdown "Policy type". Checking default value. Checking possibilities to change the value.', () => {
      const classification = ContentPolicy.COMMON_BUTTONS
      ContentPolicy.dropdown
        .getFieldByName(classification.ORGANIZATIONAL)
        .should(CONDITIONS.HAVE_TEXT, I.translate(`${general}.type.organizational`))

      ContentPolicy.dropdown.selectValueFromDropdown(classification.ORGANIZATIONAL, I.translate(`${general}.type.regulatory`))

      ContentPolicy.dropdown
        .getFieldByName(classification.REGULATORY)
        .should(CONDITIONS.HAVE_TEXT, I.translate(`${general}.type.regulatory`))

      ContentPolicy.dropdown.selectValueFromDropdown(classification.REGULATORY, I.translate(`${general}.type.organizational`))
    })
  })
})
