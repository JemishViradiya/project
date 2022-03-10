import { CONDITIONS } from '../../support/constants/conditions'
import { FLAGS } from '../../support/constants/selectors'
import { HeaderPanel } from '../../support/pages/header-panel.page'
import { NavigationPanel } from '../../support/pages/navigation-panel.page'
import { MobilePolicy } from '../../support/pages/policies-pages/mobile-policy.page'
import { Helper } from '../../support/utils/helper'

const dlpPolicyFlag = FLAGS.DLP_POLICY
const policy = `${dlpPolicyFlag}:policy`
const sections = `${policy}.sections`
describe('Verify render components on the /mobile/create', () => {
  before(() => {
    Helper.initializeBrowserFeatures()
    I.loadI18nNamespaces(FLAGS.DLP_POLICY)
    MobilePolicy.visit()
  })

  it('Checking for the side navigation to display', () => {
    NavigationPanel.getNavigation().should(CONDITIONS.BE_VISIBLE)
  })

  it('Checking is title of the header visible', () => {
    HeaderPanel.getHeadingByName(I.translate(`${policy}.addPolicyWithType`, { policyType: 'mobile' })).should(CONDITIONS.BE_VISIBLE)
  })

  it('Checking to visible of the "General Information" form, heading and fields.', () => {
    MobilePolicy.getHeadingByName(`${sections}.general.title`).should(CONDITIONS.BE_VISIBLE)
    MobilePolicy.getPolicyNameField().should(CONDITIONS.BE_VISIBLE)
    MobilePolicy.getDescriptionField().should(CONDITIONS.BE_VISIBLE)
  })

  it('Checking is "Spark Mobile settings" visible and the possibility of clickability of all checkboxes.', () => {
    MobilePolicy.getHeadingByName(`${sections}.sparkMobileSettings.title`).should(CONDITIONS.BE_VISIBLE)
    const checkboxNames = Object.values(MobilePolicy.NAMES_CHECKBOXES())
    checkboxNames.forEach(checkbox => MobilePolicy.getCheckboxByName(checkbox).should(CONDITIONS.EXIST).click())
  })

  it('Checking is "iOS specific settings" visible', () => {
    MobilePolicy.getHeadingByName(`${sections}.iosSpecificSettings.title`).should(CONDITIONS.BE_VISIBLE)
  })
})
