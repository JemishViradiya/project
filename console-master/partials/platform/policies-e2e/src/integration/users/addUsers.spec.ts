import { UsersPage } from '../../support/pages/addUsersPage'
import { UserDetails } from '../../support/pages/userDetailsPage'

interface ValidationData {
  invalidOptions: string[]
  validOptions: string[]
  getMessage: (value: string) => string
}

const newUserData = {
  country: 'Canada',
  displayName: 'agent_007',
  state: 'ON',
  street: null,
  username: 'agent_007@pew07.cbbcps.com',
  dataSource: 'azure',
  dataSourceUserId: '25c0dcd8-1253-4911-9a4e-0b9b202f1ae3',
  firstName: 'James',
  lastName: 'Bond',
  emailAddress: 'some.mail@blackhole.sw.rim.net',
  title: 'Tester',
  department: 'PerfEng',
  company: 'BlackBerry',
  city: 'Waterloo',
  postalCode: null,
  mobilePhoneNumber: null,
  companyPhoneNumber: '519-597-6003',
  homePhoneNumber: null,
}

let btnGoBack, allLeftCB, allRightCB, transferLeftBtn, transferRightBtn, btnClear

const loadProfilesStrings = () => {
  I.loadI18nNamespaces('components', 'general/form').then(() => {
    btnGoBack = I.translate(UsersPage.BUTTONS.GO_BACK)
    btnClear = I.translate(UsersPage.BUTTONS.CLEAR)
    allLeftCB = I.translate(UsersPage.TEXT.SELECT_ALL_LEFT_LABEL)
    allRightCB = I.translate(UsersPage.TEXT.SELECT_ALL_RIGHT_LABEL)
    transferLeftBtn = I.translate(UsersPage.TEXT.TRANSFER_ITEMS_LEFT_LABEL)
    transferRightBtn = I.translate(UsersPage.TEXT.TRANSFER_ITEMS_RIGHT_LABEL)
  })
}

describe('Add Users page navigate and common appearance', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    loadProfilesStrings()

    I.loadI18nNamespaces('platform/common', 'platform/validation', 'access', 'general/form').then(() => {
      I.visit('#/users/')
    })
  })

  it('Should navigate to Add Users page', () => {
    I.findByText(I.translate(UsersPage.BUTTONS.ADD_USER)).click()
    I.location().should(loc => {
      expect(loc.hash).to.eq('#/users/add')
    })
  })

  it('Should have correct help link', () => {
    UsersPage.getHelpLink().should('exist').should('have.attr', 'href', UsersPage.HELP_LINKS.USERS)
  })

  it('Should check all text on the screen', () => {
    I.findByText(I.translate(UsersPage.TEXT.PAGE_TITLE)).should('exist')
    I.findByText(I.translate(UsersPage.TEXT.SEARCHBAR_TITLE)).should('exist')
    I.findByLabelText(I.translate(UsersPage.LABELS.SEARCH_INPUT)).should('exist')
    I.findByRole('button', { name: btnGoBack }).should('exist')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SEARCH) }).should('exist')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SAVE) }).should('be.disabled')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SAVE_AND_NEW) }).should('be.disabled')
  })
})

describe('Actions on Add Users Page', () => {
  const firstUserName = 'emailreport_test1'
  const secondUserName = 'gd_002'

  it('Should check when Input is clicked', () => {
    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .click()
    I.findByRole('tooltip', { name: I.translate(UsersPage.TEXT.TOOLTIP) }).should('exist')
  })

  it('Should check when something is typed in Input', () => {
    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .type('abc')
    I.findByRole('heading', { name: I.translate(UsersPage.TEXT.NO_USERS_FOUND) }).should('exist')
    I.findByRole('button', { name: btnClear }).should('exist').click()
    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .type(firstUserName)
    I.findByRole('tooltip').should('contain', I.translate(UsersPage.TEXT.DATA_SOURCE_AZURE))
    I.findByRole('tooltip').should('contain', firstUserName)
    I.findByRole('button', { name: btnClear }).should('exist').click()
  })

  it('Should check when "Azure" user found and selected, User Details should be shown', () => {
    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .type(secondUserName)
    I.findByRole('tooltip').should('contain', secondUserName).click(50, 20)
    I.findByRole('heading', { name: I.translate(UsersPage.TEXT.USER_DETAILS) }).should('exist')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.ADDITIONAL_USER_DETAILS) }).should('exist')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.ADDITIONAL_USER_DETAILS) })
      .should('exist')
      .click()
    Object.values(UsersPage.USER_DETAILS_INPUTS_NAMES).forEach(value => {
      I.findByRole('textbox', { name: I.translate(value) })
        .should('exist')
        .should('be.disabled')
    })
    I.findByRole('button', { name: btnClear }).should('exist').click()
  })

  it('Should check when "Azure" User is selected, Save buttons should be enabled', () => {
    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .type(firstUserName)
    I.findByRole('tooltip').should('contain', firstUserName).click(50, 20)
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SAVE) }).should('be.enabled')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SAVE_AND_NEW) }).should('be.enabled')
    I.findByRole('button', { name: btnClear }).should('exist').click()
  })

  it('Should add Azure user with a group', () => {
    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .type(secondUserName)
    I.findByRole('tooltip').should('contain', secondUserName).click(50, 20)
    I.findByText(I.translate(UsersPage.TEXT.GROUPS_HEADING)).should('exist')
    I.findByText(I.translate(UsersPage.TEXT.LIST_LABEL)).should('exist')
    I.findByText(I.translate(UsersPage.TEXT.RIGHT_LABEL)).should('exist')
    I.findByText(I.translate(UsersPage.TEXT.LEFT_LABEL)).should('exist')
    I.findAllByTitle(transferRightBtn).should('exist').should('be.disabled')
    I.findAllByTitle(transferLeftBtn).should('exist').should('be.disabled')
    I.findByLabelText(allLeftCB).should('exist').click()
    I.findAllByRole('checkbox').should('be.checked')
    I.findAllByTitle(transferRightBtn).should('exist').should('be.enabled').click()
    I.findAllByRole('checkbox').should('be.not.checked')
    I.findByLabelText(allRightCB).should('exist').click()
    I.findAllByRole('checkbox').should('be.checked')
    I.findAllByTitle(transferLeftBtn).should('be.enabled').should('exist').click()
    I.findAllByRole('checkbox').should('be.not.checked')
    I.findByRole('button', { name: btnClear }).should('exist').click()
  })

  it('Should check field validation when adding a new user manually', () => {
    const maxNameLength = 64
    const maxEmailLength = 255
    const validName = 'name'
    const validEmail = 'email@example.com'
    const veryLongEmail = validEmail.padStart(maxEmailLength + 1, 'email')

    const firstNameLabel = I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.FIRST_NAME)
    const lastNameLabel = I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.LAST_NAME)
    const displayNameLabel = I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.DISPLAY_NAME)
    const emailAddressLabel = I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.EMAIL_ADDRESS)

    const getLengthValidationMessage = max => fieldName => I.translate('platform/validation:maxLength', { fieldName, max })
    const getEmptyFieldValidationMessage = fieldName => I.translate('platform/validation:emptyField', { fieldName })
    const getInvalidFieldValidationMessage = fieldName => I.translate('platform/validation:invalidField', { fieldName })

    const nameMaxLengthValidation: ValidationData = {
      invalidOptions: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'],
      validOptions: [validName],
      getMessage: getLengthValidationMessage(maxNameLength),
    }

    const emailMaxLengthValidation: ValidationData = {
      invalidOptions: [veryLongEmail],
      validOptions: [validEmail],
      getMessage: getLengthValidationMessage(maxEmailLength),
    }

    const emailCommonValidation: ValidationData = {
      invalidOptions: [
        'plainaddress',
        '#@%^%#$@#$@#.com',
        '@example.com',
        'Joe Smith <email@example.com>',
        'email.example.com',
        'email@example@example.com',
        '.email@example.com',
        'email.@example.com',
        'email..email@example.com',
        'あいうえお@example.com',
        'email@example.com (Joe Smith)',
        'email@example',
        'email@-example.com',
        'email@111.222.333.44444',
        'email@example..com',
        'Abc..123@example.com',
      ],
      validOptions: [validEmail],
      getMessage: getInvalidFieldValidationMessage,
    }

    const nameSpacingValidation: ValidationData = {
      invalidOptions: ['name    invalid   spacing', 'name invalid    spacing'],
      validOptions: ['n', '    name     ', '   name valid   '],
      getMessage: getInvalidFieldValidationMessage,
    }

    const emptyFieldValidation: ValidationData = {
      invalidOptions: [''],
      validOptions: [validName],
      getMessage: getEmptyFieldValidationMessage,
    }

    const emailEmptyFieldValidation: ValidationData = {
      invalidOptions: [''],
      validOptions: [validEmail],
      getMessage: getEmptyFieldValidationMessage,
    }

    const validateField = (fieldLabel: string, validationData: ValidationData) => {
      const { invalidOptions, validOptions, getMessage } = validationData

      invalidOptions.forEach(option => {
        if (option) {
          I.findByRole('textbox', { name: fieldLabel }).clear().type(option)
        } else {
          I.findByRole('textbox', { name: fieldLabel }).clear().type('text').clear()
        }
        I.findByText(getMessage(fieldLabel)).should('exist').and('be.visible')
      })

      validOptions.forEach(option => {
        I.findByRole('textbox', { name: fieldLabel }).clear().type(option)
        I.findByText(getMessage(fieldLabel)).should('not.exist')
      })
    }

    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .click()
    I.findByRole('tooltip', { name: I.translate(UsersPage.TEXT.TOOLTIP) }).click()

    validateField(firstNameLabel, nameSpacingValidation)
    validateField(lastNameLabel, nameSpacingValidation)
    validateField(displayNameLabel, nameSpacingValidation)
    validateField(emailAddressLabel, emailCommonValidation)

    validateField(firstNameLabel, nameMaxLengthValidation)
    validateField(lastNameLabel, nameMaxLengthValidation)
    validateField(emailAddressLabel, emailMaxLengthValidation)

    validateField(firstNameLabel, emptyFieldValidation)
    validateField(lastNameLabel, emptyFieldValidation)
    validateField(displayNameLabel, emptyFieldValidation)
    validateField(emailAddressLabel, emailEmptyFieldValidation)
  })
  it('Should check form is cleared after reset', () => {
    I.findByLabelText(allLeftCB).should('exist').click()
    I.findAllByRole('checkbox').should('be.checked')
    I.findAllByTitle(transferRightBtn).should('exist').should('be.enabled').click()

    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) })
      .should('exist')
      .click()
    I.findByRole('tooltip', { name: I.translate(UsersPage.TEXT.TOOLTIP) }).click()
    I.findByRole('dialog', { name: I.translate(UserDetails.ALERT_MESSAGE.UNSAVED_CHANGES) })
      .should('exist')
      .and('be.visible')
    I.findByRole('button', { name: I.translate(UserDetails.BUTTONS.UNSAVED_CHANGES) }).click()
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.FIRST_NAME) }).should('have.value', '')
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.LAST_NAME) }).should('have.value', '')
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.DISPLAY_NAME) }).should('have.value', '')
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.EMAIL_ADDRESS) }).should('have.value', '')
    I.findByLabelText(allRightCB)
      .should('exist')
      .within(() => {
        I.findByRole('checkbox').should('not.exist')
      })
  })
  it('Should check adding a new user manually', () => {
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.FIRST_NAME) })
      .should('exist')
      .should('be.enabled')
      .clear()
      .type(newUserData.firstName)
      .should('have.attr', 'required')
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.LAST_NAME) })
      .should('exist')
      .should('be.enabled')
      .clear()
      .type(newUserData.lastName)
      .should('have.attr', 'required')
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.DISPLAY_NAME) })
      .should('exist')
      .should('be.enabled')
      .clear()
      .type(newUserData.displayName)
      .should('have.attr', 'required')
    I.findByRole('textbox', { name: I.translate(UsersPage.USER_DETAILS_INPUTS_NAMES.EMAIL_ADDRESS) })
      .should('exist')
      .should('be.enabled')
      .clear()
      .type(newUserData.emailAddress)
      .should('have.attr', 'required')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SAVE) }).should('be.enabled')
    I.findByRole('button', { name: I.translate(UsersPage.BUTTONS.SAVE_AND_NEW) })
      .should('be.enabled')
      .click()
    I.findByText(I.translate(UsersPage.ALERT_MESSAGE.SUCCESS)).should('exist')
  })

  it('Should check that "search" is not displayed and info link is present when directory is not configured', () => {
    const directoryInfoURL = 'https://docs.blackberry.com/en/unified-endpoint-security/console/help/link-directory'

    window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')

    I.intercept('GET', '/**/api/platform/v1/directory/instance/configured', {
      statusCode: 200,
      body: false,
    }).as('getDirectories')

    I.visit('#/users/add').wait('@getDirectories')

    I.findByRole('link', { name: I.translate('users.add.directoryHelp.link') })
      .should('exist')
      .and('be.visible')
      .and('have.attr', 'href', directoryInfoURL)

    I.findByRole('textbox', { name: I.translate(UsersPage.LABELS.SEARCH_INPUT) }).should('not.exist')
  })

  it('Should redirect to not found page if permissions are missing', () => {
    UsersPage.restrictUserCreate()

    UsersPage.findNotFoundMessage().should('exist')
  })
})
