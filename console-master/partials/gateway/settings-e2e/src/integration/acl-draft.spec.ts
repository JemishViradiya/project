import { committedAclRulesMock } from '@ues-data/gateway/mocks'
import { FeatureName } from '@ues-data/shared-types'
import {
  ACL_COMMITTED_URL,
  ACL_DRAFT_ADD_URL,
  ACL_DRAFT_COPY_URL,
  ACL_DRAFT_EDIT_URL,
  ACL_DRAFT_URL,
  ADD_RULE,
  ADD_RULE_BELOW,
  AriaElementLabel,
  COMMIT_RULES,
  COMMITTED_RULES,
  COMMON_ACTION_LABEL,
  COMMON_DESCRIPTION_LABEL,
  COMMON_NAME_LABEL,
  COMMON_ORDER_LABEL,
  COMMON_SAVE_CHANGES_BUTTON,
  CommonFns,
  COPY_RULE_BELOW,
  DEFAULT_RULE_DESC,
  DELETE_RULE,
  DISCARD_DRAFT,
  DRAFT_RULES,
  DRAFT_RULES_DESC,
  ENABLE_RULE_FIELD,
  STANDARD_TIMEOUT,
  TABLE_CONTAINS,
  TABLE_DOES_NOT_CONTAIN,
  TABLE_ENDS_WITH,
  TABLE_STARTS_WITH,
} from '@ues/assets-e2e'

const { visitView, loadingIconShould, getButton, pressEscape, getRankCells, validateURL } = CommonFns(I)

const SWITCH_BUTTON = 0
const DROPDOWN_ICON_BUTTON = 0
const TABLE_REFRESH_TIMEOUT = 2000
const SHORT_WAIT_TIMEOUT = 1000

const TEXT_NAMES = {
  tooRisky: committedAclRulesMock[0].name,
  default: 'Default',
  defaultDescription: 'Default block for all network traffic',
  test: 'Test',
  publicInternet: committedAclRulesMock[3].name,
  quickTrustedItems: committedAclRulesMock[1].name,
  noFacebook: committedAclRulesMock[2].name,
}

const testCreateDraftRedirect = (message?: string) => {
  validateURL(ACL_DRAFT_URL)

  // alertMessageShouldBeEqual(t(message ?? CREATE_DRAFT_AND_SAVE_SUCCESS_MESSAGE))
  loadingIconShould('not.exist')
}

const orderItemsDescending = () => {
  I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) })
    .find('span')
    .should('exist')
    .click()
    .click()
}

const createSimpleDraft = () => {
  I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL), timeout: STANDARD_TIMEOUT }).should('exist')
  I.findAllByRole('checkbox').eq(SWITCH_BUTTON).should('exist').and('be.enabled').click()
  validateURL(ACL_DRAFT_URL)

  loadingIconShould('not.exist')
}

context('Access Control List', () => {
  context('Draft Rules', () => {
    beforeEach(() => {
      visitView(ACL_COMMITTED_URL, { [FeatureName.UESBigAclEnabled]: true }, ['components', 'gateway-settings', 'tables'])
    })

    it('should display default ACL rule', () => {
      const LAST_TABLE_ITEM = 5

      createSimpleDraft()
      I.wait(TABLE_REFRESH_TIMEOUT)

      I.findByRole('tab', { name: I.translate(COMMITTED_RULES) }).should('exist')

      I.findAllByRole('row')
        .should('exist')
        .eq(LAST_TABLE_ITEM)
        .findAllByRole('cell', { name: TEXT_NAMES.default })
        .find('a')
        .should('not.exist')

      I.findAllByRole('row')
        .should('exist')
        .eq(LAST_TABLE_ITEM)
        .findAllByRole('cell', { name: I.translate(DEFAULT_RULE_DESC) })
        .should('exist')

      I.findAllByRole('row')
        .should('exist')
        .eq(LAST_TABLE_ITEM)
        .findAllByRole('checkbox')
        .eq(SWITCH_BUTTON)
        .should('exist')
        .and('be.disabled')
    })

    it('should check if all elements are loaded', () => {
      createSimpleDraft()

      I.findByRole('tab', { name: I.translate(COMMITTED_RULES) }).should('exist')

      I.findAllByText(I.translate(DRAFT_RULES_DESC))

      getButton(I.translate(ADD_RULE)).should('exist')
      getButton(I.translate(COMMON_ORDER_LABEL)).should('exist')

      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) }).should('exist')
      I.findAllByRole('columnheader', { name: I.translate(COMMON_NAME_LABEL) }).should('exist')
      I.findAllByRole('columnheader', { name: I.translate(COMMON_DESCRIPTION_LABEL) }).should('exist')
      I.findAllByRole('columnheader', { name: I.translate(COMMON_ACTION_LABEL) }).should('exist')
      I.findAllByRole('columnheader', { name: I.translate(ENABLE_RULE_FIELD) }).should('exist')
      I.findAllByRole('checkbox').eq(SWITCH_BUTTON).should('exist').and('be.enabled')
    })

    it('should be able to reorder rules', () => {
      const FIRST_INFINITE_TABLE_ROW = 1

      createSimpleDraft()
      orderItemsDescending()

      I.findAllByRole('row')
        .should('exist')
        .eq(FIRST_INFINITE_TABLE_ROW, { timeout: STANDARD_TIMEOUT })
        .findAllByRole('cell', { name: TEXT_NAMES.tooRisky })

      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) })
        .find('span')
        .should('exist')
        .click()

      I.findAllByRole('row').should('exist').eq(FIRST_INFINITE_TABLE_ROW).findAllByRole('cell', { name: TEXT_NAMES.default })
    })

    it('should be able to filter rules by description', () => {
      const DESCRIPTION_FILTER_BUTTON = 1

      createSimpleDraft()
      orderItemsDescending()

      I.findAllByRole('columnheader', { name: I.translate(COMMON_DESCRIPTION_LABEL) })
        .should('exist')
        .findAllByRole('button')
        .eq(DESCRIPTION_FILTER_BUTTON)
        .click()

      I.findByRole('button').click()

      getButton(I.translate(TABLE_CONTAINS))
      getButton(I.translate(TABLE_DOES_NOT_CONTAIN))
      getButton(I.translate(TABLE_STARTS_WITH))
      getButton(I.translate(TABLE_ENDS_WITH))

      I.findByRole('textbox').type(TEXT_NAMES.defaultDescription)
      pressEscape(I)
      I.wait(TABLE_REFRESH_TIMEOUT)

      I.findAllByRole('cell', { name: TEXT_NAMES.default }).should('exist')
      I.findAllByRole('cell', { name: TEXT_NAMES.tooRisky, timeout: STANDARD_TIMEOUT }).should('not.exist')
    })

    it('should be able to filter rules by name', () => {
      const NAME_FILTER_BUTTON = 1

      createSimpleDraft()
      orderItemsDescending()

      I.findAllByRole('columnheader', { name: I.translate(COMMON_NAME_LABEL) })
        .should('exist')
        .findAllByRole('button')
        .eq(NAME_FILTER_BUTTON)
        .click()

      I.findByRole('button').click()

      getButton(I.translate(TABLE_CONTAINS))
      getButton(I.translate(TABLE_DOES_NOT_CONTAIN))
      getButton(I.translate(TABLE_STARTS_WITH))
      getButton(I.translate(TABLE_ENDS_WITH))

      I.findByRole('textbox').type(TEXT_NAMES.default)
      pressEscape(I)
      I.wait(TABLE_REFRESH_TIMEOUT)

      I.findAllByRole('cell', { name: TEXT_NAMES.default, timeout: STANDARD_TIMEOUT }).should('exist')
      I.findAllByRole('cell', { name: TEXT_NAMES.tooRisky, timeout: STANDARD_TIMEOUT }).should('not.exist')
    })

    it('should be able to edit draft rule', () => {
      createSimpleDraft()

      I.findAllByRole('checkbox').eq(SWITCH_BUTTON).should('exist').and('be.enabled')
      I.findByRole('cell', { name: TEXT_NAMES.tooRisky }).find('a').click()
      validateURL(ACL_DRAFT_EDIT_URL)

      loadingIconShould('not.exist')

      I.findAllByRole('textbox').should('exist').and('be.enabled')
      I.findAllByRole('checkbox').should('exist').and('be.enabled')
      I.findAllByRole('button').should('exist').and('be.enabled')
      I.findByRole('textbox', { name: I.translate(COMMON_NAME_LABEL) })
        .should('exist')
        .clear()
        .type(TEXT_NAMES.test)

      I.findAllByRole('button', { name: 'discard-changes-button' }).should('exist')
      I.findAllByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('exist').click()

      I.findByRole('tab', { name: I.translate(DRAFT_RULES) }).should('exist')
      I.findByRole('cell', { name: TEXT_NAMES.tooRisky }).should('not.exist')
      I.findByRole('cell', { name: TEXT_NAMES.test }).should('exist')

      getButton(I.translate(DISCARD_DRAFT)).should('be.visible')
      getButton(I.translate(COMMIT_RULES)).should('be.visible')
    })

    it('should be able to copy rule below', () => {
      createSimpleDraft()

      loadingIconShould('not.exist')
      orderItemsDescending()

      I.findAllByLabelText('dropdown-icon-button').should('exist').eq(DROPDOWN_ICON_BUTTON).click()
      I.findAllByRole('menuitem', { name: I.translate(COPY_RULE_BELOW) }).click()

      loadingIconShould('not.exist')
      validateURL(`${ACL_DRAFT_COPY_URL}?rank=2`)

      I.findByRole('textbox', { name: I.translate(COMMON_NAME_LABEL) })
        .should('exist')
        .clear()
        .type(TEXT_NAMES.test)
      I.findAllByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('exist').click()

      testCreateDraftRedirect()

      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) }).should('exist')

      I.findByRole('cell', { name: TEXT_NAMES.tooRisky }).should('exist')
      I.findByRole('cell', { name: TEXT_NAMES.test }).should('exist')
    })

    it('should be able to add rule below', () => {
      const ADDED_RULE_POSITION = 2

      createSimpleDraft()

      I.findAllByLabelText('dropdown-icon-button').should('exist').eq(DROPDOWN_ICON_BUTTON).click()
      I.findAllByRole('menuitem', { name: I.translate(ADD_RULE_BELOW) }).click()

      loadingIconShould('not.exist')
      validateURL(`${ACL_DRAFT_ADD_URL}?rank=2`)

      I.findByRole('textbox', { name: I.translate(COMMON_NAME_LABEL) })
        .should('exist')
        .clear()
        .type(TEXT_NAMES.test)
        .wait(SHORT_WAIT_TIMEOUT)
      I.findAllByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('exist').click()

      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) })
        .should('exist')
        .click()

      I.findByRole('cell', { name: TEXT_NAMES.tooRisky, timeout: STANDARD_TIMEOUT }).should('exist')
      I.findAllByRole('row').eq(ADDED_RULE_POSITION).should('exist').findByRole('cell', { name: TEXT_NAMES.test }).should('exist')
    })

    it('should be able to add rule', () => {
      const LAST_RULE_POSITION = 5

      createSimpleDraft()
      loadingIconShould('not.exist')

      getButton('Add rule').should('exist').click()

      loadingIconShould('not.exist')
      validateURL(ACL_DRAFT_ADD_URL)

      I.findByRole('textbox', { name: I.translate(COMMON_NAME_LABEL) })
        .should('exist')
        .clear()
        .type(TEXT_NAMES.test)
        .wait(SHORT_WAIT_TIMEOUT)
      I.findAllByRole('button', { name: AriaElementLabel.StickyActionsSaveButton }).should('exist').click()

      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) }).should('exist')

      I.findByRole('cell', { name: TEXT_NAMES.tooRisky, timeout: STANDARD_TIMEOUT }).should('exist')

      orderItemsDescending()
      I.findAllByRole('row').eq(LAST_RULE_POSITION).should('exist').findByRole('cell', { name: TEXT_NAMES.test }).should('exist')
    })

    it('should be able to delete a rule', () => {
      createSimpleDraft()

      loadingIconShould('not.exist')
      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) }).should('exist')

      I.findAllByLabelText('dropdown-icon-button').should('exist').eq(DROPDOWN_ICON_BUTTON).click()
      I.findAllByRole('menuitem', { name: I.translate(DELETE_RULE) }).click()

      loadingIconShould('not.exist')

      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL) }).should('exist')

      I.findByRole('cell', { name: TEXT_NAMES.tooRisky }).should('not.exist')
    })

    it('should be able to enter order mode and change it', () => {
      const FIRST_ITEM = 1
      const ORDER_BUTTON = 0
      const ARROW_UP_ICON = 0
      const ARROW_DOWN_ICON = 1
      const LAST_ITEM = 4
      const FIRST_ITEM_ORDER = '1'
      const LAST_ITEM_ORDER = '4'

      createSimpleDraft()

      loadingIconShould('not.exist')
      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL), timeout: STANDARD_TIMEOUT }).should('exist')

      orderItemsDescending()

      getButton(I.translate(COMMON_ORDER_LABEL)).eq(ORDER_BUTTON).should('exist').click()

      I.findByRole('tab', { name: I.translate(COMMITTED_RULES) })
        .should('exist')
        .and('be.disabled')
      I.findByRole('tab', { name: I.translate(DRAFT_RULES) })
        .should('exist')
        .and('be.disabled')

      getRankCells().should('exist')
      getRankCells().eq(LAST_ITEM).findAllByRole('button').eq(ARROW_DOWN_ICON).should('be.disabled')
      getRankCells().eq(LAST_ITEM).findAllByRole('button').eq(ARROW_UP_ICON).should('be.enabled')
      getRankCells().eq(LAST_ITEM).findByRole('textbox').should('have.value', LAST_ITEM_ORDER)

      getRankCells().eq(FIRST_ITEM).findAllByRole('button').eq(ARROW_DOWN_ICON).should('be.enabled')
      getRankCells().eq(FIRST_ITEM).findAllByRole('button').eq(ARROW_UP_ICON).should('be.disabled')
      getRankCells().eq(FIRST_ITEM).findByRole('textbox').should('have.value', FIRST_ITEM_ORDER)

      getRankCells().eq(LAST_ITEM).findAllByRole('button').eq(ARROW_UP_ICON).click()
      I.findAllByRole('row').eq(3).should('exist').findByRole('cell', { name: TEXT_NAMES.publicInternet }).should('exist')
      I.findAllByRole('row').eq(4).should('exist').findByRole('cell', { name: TEXT_NAMES.noFacebook }).should('exist')

      getRankCells().eq(FIRST_ITEM).findByRole('textbox').clear().type('1').type('{enter}')
      I.findAllByRole('row').eq(2).should('exist').findByRole('cell', { name: TEXT_NAMES.quickTrustedItems }).should('exist')

      getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.enabled')
    })

    it('should not be able to save changed order', () => {
      const FIRST_ITEM = 1
      const INVALID_VALUE = '50'

      createSimpleDraft()

      loadingIconShould('not.exist')
      I.findAllByRole('columnheader', { name: I.translate(COMMON_ORDER_LABEL), timeout: STANDARD_TIMEOUT })
        .should('exist')
        .click()
        .click()

      getButton(I.translate(COMMON_ORDER_LABEL)).eq(0).should('exist').click()

      I.findByRole('tab', { name: I.translate(COMMITTED_RULES) })
        .should('exist')
        .and('be.disabled')
      I.findByRole('tab', { name: I.translate(DRAFT_RULES) })
        .should('exist')
        .and('be.disabled')

      getRankCells().should('exist')
      getRankCells().eq(FIRST_ITEM).findByRole('textbox').clear().type(INVALID_VALUE).type('{enter}')

      getButton(I.translate(COMMON_SAVE_CHANGES_BUTTON)).should('be.disabled')
    })
  })
})
