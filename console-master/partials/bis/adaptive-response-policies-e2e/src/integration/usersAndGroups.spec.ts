import { BffPlatform } from '@ues-data/platform/mocks'

import { getSnackbar, TranslationKeys, verifyHashEquals, visitPage } from '../support/utils'

const MOCK_NETWORK_ACCESS_POLICIES = BffPlatform.defaultProfilesMock.profiles.elements
const MOCK_USERS_AND_GROUPS = BffPlatform.profileMembersMock.profileMembers.elements

describe('Persona adaptive response policies', () => {
  before(() => {
    I.loadI18nNamespaces('components', 'navigation', 'gateway-settings', 'profiles', 'bis/shared', 'bis/ues')
  })
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })
  describe('Users and Groups Policy assignment (C87351450)', () => {
    before(() => {
      visitPage('#/list/adaptiveResponse', contentWindow => {
        contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
        contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
        contentWindow.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
      })
    })
    const mockPolicy = MOCK_NETWORK_ACCESS_POLICIES[0]
    const uncheckedUser = 'David User'
    it('Should display policy list screen', () => {
      I.findByRoleWithin('navigation', 'link', { name: I.translate(TranslationKeys.gateway) }).trigger('mouseover')
      I.findByRole('button', { name: I.translate(TranslationKeys.policies) }).click()
      I.findByRoleWithin('tablist', 'tab', { name: I.translate(TranslationKeys.adaptiveResponse) }).click()
      verifyHashEquals('#/list/adaptiveResponse')
    })
    it('Should display policy details edit screen', () => {
      I.findByRoleOptionsWithin('cell', { name: mockPolicy.name }, 'link', { name: mockPolicy.name }).should('be.visible').click()
      verifyHashEquals(`#/adaptiveResponse/${mockPolicy.entityId}`)
    })
    it('Should display Users and Groups list', () => {
      I.findByRoleWithin('tablist', 'tab', { name: I.translate(TranslationKeys.assignedUsersAndGroups) })
        .should('be.visible')
        .click()
      verifyHashEquals(`#/adaptiveResponse/${mockPolicy.entityId}/applied`)
      I.findByRoleWithin('grid', 'rowgroup', { name: 'grid' }).should('exist')
      MOCK_USERS_AND_GROUPS.forEach((userOrGroup, i) => {
        I.findByInfiniteTableCell(i, 0).should('contain', userOrGroup.name || userOrGroup.displayName || '')
        I.findByInfiniteTableCell(i, 1).should('contain', userOrGroup.emailAddress || '')
      })
    })
    it('Should display search box', () => {
      I.findByRole('button', { name: I.translate(TranslationKeys.addUserOrGroup) })
        .should('be.visible')
        .should('be.enabled')
        .click()
      I.findByRole('textbox', { name: I.translate(TranslationKeys.searchUsersOrGroupsLabel) }).should('be.visible')
    })
    it('Should display list of users/groups from search', () => {
      I.findByRole('textbox', { name: I.translate(TranslationKeys.searchUsersOrGroupsLabel) })
        .should('be.visible')
        .type('user')
      MOCK_USERS_AND_GROUPS.forEach(userOrGroup => {
        const labelName =
          userOrGroup.__typename === 'User'
            ? userOrGroup.name || userOrGroup.displayName
            : `${userOrGroup.name || userOrGroup.displayName} ${userOrGroup.relationships.users.count} users`
        if (labelName) I.findByRole('button', { name: labelName }).should('have.attr', 'aria-disabled')
      })
    })
    it('Should display selected users/groups', () => {
      I.findByRole('checkbox', { name: uncheckedUser }).should('be.enabled').should('not.be.checked').check()
      I.findAllByRole('button', { name: uncheckedUser }).find('.MuiChip-label').should('contain', uncheckedUser)
    })
    it('Should add users/groups to policy', () => {
      // note cannot fully verify (in list), toast only
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.cancelButton) }).should('be.enabled')
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.addButton) })
        .should('be.enabled')
        .click()
      getSnackbar(I.translate(TranslationKeys.successfulAssignment)).should('be.visible')
    })
  })
})
