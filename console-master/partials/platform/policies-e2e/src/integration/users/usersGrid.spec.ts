import { reduxQuery } from '@ues-behaviour/shared-e2e'
import { usersMock } from '@ues-data/platform/mocks'
import { FeatureName, makePageableResponse } from '@ues-data/shared-types'

import { users as userMocks } from '../../support/commands'
import { UserGrid } from '../../support/pages/userGridPage'

const mockUserCount = usersMock.count
const randomRowCount = Math.floor(Math.random() * (mockUserCount - 2) + 2)
const userEmail = usersMock.elements[0].emailAddress
const userName = usersMock.elements[0].displayName

describe('User Grid', () => {
  before(() => {
    window.localStorage.setItem(FeatureName.UESCronosNavigation, 'false')
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    UserGrid.loadStrings()
    I.loadI18nNamespaces('platform/common', 'access').then(() => {
      I.fixture(userMocks).then(mocks => {
        I.visit('#/users/', {
          onBeforeLoad: contentWindow => {
            contentWindow.model.mockAll({
              id: 'platform.users.queryUsers.redux',
              data: reduxQuery({
                result: makePageableResponse(mocks.users.data),
              }),
            })
          },
        })
      })
    })
  })

  it('Should check ajax page title', () => {
    I.findByRoleWithin('banner', 'heading', { name: I.translate(UserGrid.TEXT.SECTION_TITLE_GATEWAY) }).should('exist')
    I.findByRoleWithin('banner', 'heading', { name: I.translate(UserGrid.TEXT.SECONDARY_SECTION_TITLE) }).should('exist')
  })

  it('Should check cronos page title', () => {
    window.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
    I.reload()

    I.findByRoleWithin('banner', 'heading', { name: I.translate(UserGrid.TEXT.SECTION_TITLE_ASSETS) }).should('exist')
    UserGrid.getElementByText(UserGrid.TEXT.SECONDARY_SECTION_TITLE).should('exist')
  })

  it('Should load user table and should not be empty', () => {
    I.fixture(userMocks).then(mocks => {
      I.findAllByRole('row')
        .its('length')
        .should('be.eq', mocks.users.data.length + 1)
      I.findByRole('grid').should('not.contain.text', UserGrid.TEXT.NO_DATA())
    })
  })
})

describe('User Grid Buttons', () => {
  it('Should display "Add Users" button and not display "Resend Invitation" and "Delete Users" buttons', () => {
    UserGrid.getAddButton().should('exist')
    UserGrid.getResendInvitationButton().should('not.exist')
    UserGrid.getDeleteUsersButton().should('not.exist')
  })

  it('Should select all users by clicking on select all checkbox and should make buttons "Resend Invitation" and "Delete Users" visible', () => {
    UserGrid.getSelectAllUsersCheckbox().click()
    I.findAllByRole('checkbox')
      .should('be.checked')
      .its('length')
      .should('be.eq', mockUserCount + 1)
    UserGrid.getResendInvitationButton().should('exist')
    UserGrid.getDeleteUsersButton().should('exist')
    UserGrid.getSelectAllUsersCheckbox().click()
  })

  it('Should undo select all users and "Resend Invitation" and "Delete Users" buttons should not be visible', () => {
    UserGrid.getSelectAllUsersCheckbox().click()
    UserGrid.getSelectAllUsersCheckbox().should('be.checked')
    UserGrid.getSelectAllUsersCheckbox().click()
    UserGrid.getSelectAllUsersCheckbox().should('not.be.checked')
    UserGrid.getResendInvitationButton().should('not.exist')
    UserGrid.getDeleteUsersButton().should('not.exist')
  })

  it('Should make buttons "Resend Invitation" and "Delete Users" visible when 1 User selected', () => {
    UserGrid.getRandomCheckbox(randomRowCount).click()
    UserGrid.getResendInvitationButton().should('exist')
    UserGrid.getDeleteUsersButton().should('exist')
    UserGrid.getRandomCheckbox(randomRowCount).click()
    UserGrid.getRandomCheckbox(randomRowCount).should('not.be.checked')
  })

  it('Should undo select 1 user and "Resend Invitation" and "Delete Users" buttons should not be visible', () => {
    const randomCB = UserGrid.getRandomCheckbox(randomRowCount)
    randomCB.click()
    randomCB.click()
    randomCB.should('not.be.checked')
    UserGrid.getResendInvitationButton().should('not.exist')
    UserGrid.getDeleteUsersButton().should('not.exist')
  })

  it('Should check popup when "Resend Invitation" clicked and submitted', () => {
    UserGrid.getRandomCheckbox(randomRowCount).click()
    UserGrid.getResendInvitationButton().click()
    UserGrid.waitForDialog()
      .should('be.visible')
      .within(popup => {
        I.wrap(popup).findByRole('button', { name: UserGrid.BUTTONS.RESEND_INVITATION() }).should('exist')
        I.wrap(popup).findByRole('button', { name: UserGrid.BUTTONS.RESEND_INVITATION() }).click()
      })
    I.findByText(UserGrid.TEXT.INVITATION_SEND_SUCCESS()).should('exist')
  })

  it('Should check popup when "Delete" clicked and submitted', () => {
    UserGrid.getRandomCheckbox(randomRowCount).click()
    UserGrid.getDeleteUsersButton().click()
    UserGrid.waitForDialog()
      .should('be.visible')
      .within(popup => {
        UserGrid.getElementFromContainerByText(popup, UserGrid.BUTTONS.DELETE).click()
      })
    UserGrid.getElementByText(UserGrid.TEXT.DELETE_SUCCESS).should('exist')
  })

  it('Should navigate to add users page when "Add Users" button is clicked', () => {
    UserGrid.getAddButton().should('exist')
    UserGrid.getAddButton().click()
    I.location().should(loc => {
      expect(loc.hash).to.eq('#/users/add')
    })
    I.visit('#/users/')
  })
})

describe('User Grid Filter', () => {
  it('Should check filter by "Filter Name"', () => {
    UserGrid.getHeaderCell(2).click()
    I.findByRoleWithin('presentation', 'textbox').type(userName)
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(userName).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should clear filter when "Filter Name" added', () => {
    UserGrid.getHeaderCell(2).click()
    I.findByRoleWithin('presentation', 'textbox').type(userName)
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(userName).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should check filter by "Email Address" button', () => {
    UserGrid.getHeaderCell(3).click()
    I.findByRoleWithin('presentation', 'textbox').type(userEmail)
    UserGrid.getPresentation().wait(100).click('top')
    UserGrid.getButtonByText(userEmail).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should clear filter when "Email Address" added', () => {
    UserGrid.getHeaderCell(3).click()
    I.findByRoleWithin('presentation', 'textbox').type(userEmail)
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(userEmail).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should check if there are options to select from, when clicking on "Source" button', () => {
    UserGrid.getHeaderCell(4).click()
    I.findByRole('menuitem', { name: UserGrid.TEXT.SOURCE_BB() }).should('exist')
    I.findByRole('menuitem', { name: UserGrid.TEXT.SOURCE_AZURE() }).should('exist')
    I.findByRole('menuitem', { name: UserGrid.TEXT.SOURCE_LDAP() }).should('exist')
    I.findByRole('menuitem', { name: UserGrid.TEXT.SOURCE_AD() }).should('exist')
    UserGrid.getPresentation().click('top')
  })

  it('Should check source filter when "BlackBerry Online" selected', () => {
    UserGrid.getHeaderCell(4).click()
    UserGrid.getMenuItem(UserGrid.TEXT.SOURCE_BB()).click()
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(UserGrid.SOURCE_VALUES.BB()).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should check source filter when "Microsoft Azure" selected', () => {
    UserGrid.getHeaderCell(4).click()
    UserGrid.getMenuItem(UserGrid.TEXT.SOURCE_AZURE()).click()
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(UserGrid.SOURCE_VALUES.AZURE()).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should check source filter when "LDAP" selected', () => {
    UserGrid.getHeaderCell(4).click()
    UserGrid.getMenuItem(UserGrid.TEXT.SOURCE_LDAP()).click()
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(UserGrid.SOURCE_VALUES.LDAP()).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should check source filter when "Active Directory" selected', () => {
    UserGrid.getHeaderCell(4).click()
    UserGrid.getMenuItem(UserGrid.TEXT.SOURCE_AD()).click()
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(UserGrid.SOURCE_VALUES.ACTIVE_DIRECTORY()).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should clear filter when "Source Filter" selected', () => {
    UserGrid.getHeaderCell(4).click()
    UserGrid.getMenuItem(UserGrid.TEXT.SOURCE_AD()).click()
    UserGrid.getPresentation().click('top')
    UserGrid.getButtonByText(UserGrid.SOURCE_VALUES.ACTIVE_DIRECTORY()).should('exist')
    I.findByText(UserGrid.TEXT.CLEAR).click()
  })

  it('Should check column picker checkboxes amount equals 3', () => {
    const checkboxsAmount = 3
    UserGrid.getColumnPickerBtn().click()
    UserGrid.getPresentation()
      .should('exist')
      .within(columnPicker => {
        I.wrap(columnPicker).findAllByRole('checkbox').its('length').should('be.eq', checkboxsAmount)
      })
    UserGrid.getPresentation().click()
  })

  it('Should check displayed columns according to the selected checkboxes', () => {
    const emailColumn = UserGrid.TABLE_CONTENT_COLUMNS[1]

    UserGrid.getColumnPickerBtn().click()
    UserGrid.getPresentation()
      .should('exist')
      .within(columnPicker => {
        UserGrid.TABLE_CONTENT_COLUMNS.forEach(column => {
          I.wrap(columnPicker).find(`[aria-labelledby=${column}]`).should('exist').and('be.checked')
        })
      })
      .click()
    UserGrid.TABLE_CONTENT_COLUMNS.forEach(column => {
      I.findAllByRole('button').get(`[data-field=${column}]`).should('exist')
    })

    UserGrid.getColumnPickerBtn().click()
    UserGrid.getPresentation()
      .should('exist')
      .within(columnPicker => {
        I.wrap(columnPicker).find(`[aria-labelledby=${emailColumn}]`).click().should('not.be.checked')
      })
      .click()

    I.findAllByRole('button').get(`[data-field=${emailColumn}]`).should('not.exist')
  })
})

describe('User grids RBAC', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    UserGrid.loadStrings()
    I.loadI18nNamespaces('platform/common').then(() => {
      I.visit('#/users/')
    })
  })

  it('Should select all users and should make buttons "Resend Invitation" and "Delete Users" invisible', () => {
    UserGrid.getSelectAllUsersCheckbox().click()
    I.findAllByRole('checkbox')
      .should('be.checked')
      .its('length')
      .should('be.eq', mockUserCount + 1)
    UserGrid.setReadonlyUserPermissions()

    UserGrid.getResendInvitationButton().should('not.exist')
    UserGrid.getDeleteUsersButton().should('not.exist')
    UserGrid.getSelectAllUsersCheckbox().click()
  })

  it('Should redirect to not found page if read permissions are missing', () => {
    UserGrid.setNoUserPermissions()

    UserGrid.findNotFoundMessage()
  })
})
