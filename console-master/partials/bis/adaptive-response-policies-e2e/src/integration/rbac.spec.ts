import { FeatureName, Permission } from '@ues-data/shared-types'
import { CommonFns } from '@ues/assets-e2e'

import {
  getPolicyDescriptionTextField,
  getPolicyNameTextField,
  TranslationKeys,
  verifyHashEquals,
  visitPage,
} from '../support/utils'

const { loadingIconShould } = CommonFns(I)
const MOCK_POLICY_ID = '9906e78b-4ccc-4080-8b6c-fd2367c45d02'

describe('Persona adaptive response policies', () => {
  let noAccessTitle
  let noAccessDescription
  before(() => {
    I.loadI18nNamespaces('components', 'access', 'gateway-settings', 'profiles', 'bis/shared', 'bis/ues').then(() => {
      noAccessTitle = I.translate('access:errors.notFound.title')
      noAccessDescription = I.translate('access:errors.notFound.description')
    })
  })
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.UESActionOrchestrator, 'false')
    window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
    loadingIconShould('not.exist')
  })
  describe('RBAC', () => {
    describe('Policy Details', () => {
      describe('Read', () => {
        it('Should redirect from policy when Read permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByText(noAccessTitle).should('exist')
          I.findByText(noAccessDescription).should('exist')
        })
        it('Should redirect from policy applied users when Read permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}/applied`)

          I.findByText(noAccessTitle).should('exist')
          I.findByText(noAccessDescription).should('exist')
        })
        it('Should display policy data when Read permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          getPolicyNameTextField().should('be.visible')
          getPolicyDescriptionTextField().should('be.visible')
        })
      })
      describe('Edit', () => {
        it('Should disable editing fields when Edit permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_UPDATE] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          getPolicyNameTextField().should('be.disabled')
          getPolicyDescriptionTextField().should('be.disabled')
        })
        it('Should allow editing fields when Edit permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_UPDATE] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          getPolicyNameTextField().should('be.enabled')
          getPolicyDescriptionTextField().should('be.enabled')
        })
      })
      describe('Create', () => {
        it('Should redirect when Create permission is false on /create', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_CREATE] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage('#/adaptiveResponse/create')

          I.findByText(noAccessTitle).should('exist')
          I.findByText(noAccessDescription).should('exist')
        })
        it('Should disable copy button on existing policy when Create permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_CREATE] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByRole('button', { name: I.translate(TranslationKeys.copyPolicy) }).should('be.disabled')
        })
        it('Should navigate to /create when copy button is clicked on existing policy if Create permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_CREATE] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          I.findByRole('button', { name: I.translate(TranslationKeys.copyPolicy) }).click()
          verifyHashEquals('#/adaptiveResponse/create')
          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          getPolicyNameTextField().should('be.enabled')
          getPolicyDescriptionTextField().should('be.enabled')
        })
        it('Should allow policy creation when Create permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_CREATE] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage('#/adaptiveResponse/create')

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          getPolicyNameTextField().should('be.enabled')
          getPolicyDescriptionTextField().should('be.enabled')
        })
      })
      describe('Delete', () => {
        it('Should disable delete button when Delete permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_DELETE] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByRole('button', { name: I.translate(TranslationKeys.deleteButton) }).should('be.disabled')
        })
        it('Should allow policy deletion when Delete permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_DELETE] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}`)

          I.findByRole('button', { name: I.translate(TranslationKeys.deleteButton) }).click()
          I.findByRole('dialog').should('be.visible')
        })
      })
    })
    describe('Applied Users and Groups', () => {
      describe('Read', () => {
        it('Should show applied users and groups when Policy Read permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.ECS_USERS_READ] = false
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}/applied`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardTitle)).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardDescription)).should('not.exist')
          I.findByRole('grid').should('exist')
        })
        it('Should redirect from applied users and groups when Policy Read permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}/applied`)

          I.findByText(noAccessTitle).should('exist')
          I.findByText(noAccessDescription).should('exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardTitle)).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardDescription)).should('not.exist')
          I.findByRole('grid').should('not.exist')
        })
      })
      describe('Update', () => {
        it('Should allow editing applied users and groups when Users:Update permission is true', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.ECS_USERS_UPDATE] = true
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = true
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}/applied`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardTitle)).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardDescription)).should('not.exist')
          I.findByRole('grid').should('exist')
          I.findByRole('button', { name: I.translate(TranslationKeys.addUserOrGroup) })
            .should('be.enabled')
            .click()
          I.findByRole('dialog').should('be.visible')
        })
        it('Should not allow editing users and groups when Users:Update permission is false', () => {
          const overridePermissionsObj = {}
          overridePermissionsObj[Permission.BIS_RISKPROFILE_READ] = true
          overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
          I.overridePermissions({ ...overridePermissionsObj })
          visitPage(`#/adaptiveResponse/${MOCK_POLICY_ID}/applied`)

          I.findByText(noAccessTitle).should('not.exist')
          I.findByText(noAccessDescription).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardTitle)).should('not.exist')
          I.findByText(I.translate(TranslationKeys.noPermissionCardDescription)).should('not.exist')
          I.findByRole('grid').should('exist')
          I.findByRole('button', { name: I.translate(TranslationKeys.addUserOrGroup) }).should('not.exist')
        })
      })
    })
  })
})
