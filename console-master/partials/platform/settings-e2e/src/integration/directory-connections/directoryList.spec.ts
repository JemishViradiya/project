import { i18n, I18nFormats } from '@ues-behaviour/shared-e2e'
import { directoryInstanceMock, mockSyncState } from '@ues-data/platform/mocks'

import { BasePage } from '../../support/pages/basePage'
import {
  getDialog,
  getPresentationWithin,
  getSyncTypes,
  setFullPermissions,
  setNoPermissions,
  setReadonlyPermissions,
} from '../../support/pages/directoryPage'

const baseUrl = '#/settings/directory-connections/company-directory/'

const SyncState = {
  SUCCEEDED: 'SUCCEEDED',
  RUNNING: 'RUNNING',
}

let syncTypes: Record<string, string>
let pageDescription: string
let directoryTypes: Record<string, string>
let tableHeaders: Record<string, string>
let deleteConnectionTitle: string
let deleteDialogDeleteNote: string
let syncDialogTitle: string
let syncDialogConfirmText: string

const formatDate = date => {
  return i18n.format(new Date(date), I18nFormats.DateTime)
}

const loadStrings = () => {
  I.loadI18nNamespaces('platform/common', 'access', 'components', 'general/form').then(() => {
    pageDescription = I.translate('platform/common:directory.description')
    deleteConnectionTitle = I.translate('platform/common:directory.removeConnection')
    deleteDialogDeleteNote = I.translate('platform/common:directory.deleteConnectionDialog.deleteNote')
    syncDialogTitle = I.translate('platform/common:directory.sync.dialogTitle')
    syncDialogConfirmText = I.translate('platform/common:directory.sync.confirm')
    directoryTypes = {
      AZURE: I.translate('platform/common:directory.type.AZURE'),
      AD: I.translate('platform/common:directory.type.AD'),
      ACTIVE_DIRECTORY: I.translate('platform/common:directory.type.ACTIVE_DIRECTORY'),
      LDAP: I.translate('platform/common:directory.type.LDAP'),
    }
    tableHeaders = {
      connection: I.translate('platform/common:directory.tableHeader.connection'),
      type: I.translate('platform/common:directory.tableHeader.type'),
      lastSync: I.translate('platform/common:directory.tableHeader.lastSync'),
      sync: I.translate('platform/common:directory.tableHeader.sync'),
    }
    syncTypes = getSyncTypes()
  })
}

const getAddConnectionButton = () => I.findByText(I.translate('platform/common:directory.actions.add'))
const getTable = () => I.findByTitle(I.translate('platform/common:directory.tableTitle'))
const getDeleteConnectionButton = () => I.findByRole('button', { name: deleteConnectionTitle })
const getSyncButton = () => I.findByRole('button', { name: I.translate('platform/common:directory.sync.action.start') })
const getCancelSyncLink = () => I.findByRole('link', { name: I.translate('platform/common:directory.sync.action.cancel') })

const verifyTableDetails = (readonly: boolean) => {
  getTable()
    .find('thead')
    .within(() => {
      Object.values(tableHeaders).forEach(header => {
        I.findByText(header).should('exist').and('be.visible')
      })
    })

  directoryInstanceMock.forEach((directory, index) => {
    const { name, type, id } = directory
    const { syncEnd, syncState } = mockSyncState[id]
    const isSyncRunnig = SyncState.RUNNING === syncState
    const isSyncSucceeded = SyncState.SUCCEEDED === syncState
    const syncDate = formatDate(syncEnd)

    I.findAllByRole('row')
      .get(`[aria-rowindex=${index + 1}]`)
      .within(() => {
        I.findByText(name).should('exist')
        I.findByText(directoryTypes[type]).should('exist')

        if (isSyncSucceeded) {
          I.findByText(syncDate)
        }

        if (isSyncRunnig) {
          I.findByRole('progressbar').should('exist')
          I.findByText(I.translate('platform/common:directory.sync.state.RUNNING')).should('exist')
        }

        if (readonly) {
          if (isSyncRunnig) {
            getCancelSyncLink().should('not.exist')
          }

          getSyncButton().should('not.exist')
          getDeleteConnectionButton().should('not.exist')
        } else {
          if (isSyncRunnig) {
            getCancelSyncLink().should('exist')
          }

          getSyncButton().should('exist').and('be.visible')
          getDeleteConnectionButton().should('exist').and('be.visible')
        }
      })
  })
}

describe('Directory Connections List Test Cases', () => {
  before(() => {
    loadStrings()
    BasePage.clearLocalStorage()
    BasePage.setLocalStorageState()
    I.visit(baseUrl)
  })

  it('Should navigate to Directory Connections page', () => {
    I.location().should(loc => {
      expect(loc.hash).to.eq(baseUrl)
    })
  })

  it('Should check all content on the page', () => {
    I.findByText(pageDescription).should('exist').and('be.visible')
    getAddConnectionButton().should('exist').and('be.visible')
    getTable().should('exist').and('be.visible')
    verifyTableDetails(false)
  })

  it('Should table rows be sortable', () => {
    getTable().find('th[aria-colindex="1"]').should('have.attr', 'aria-sort', 'ascending')
    directoryInstanceMock.forEach((directory, index) => {
      I.findAllByRole('row')
        .get(`[aria-rowindex=${index + 1}]`)
        .should('contain', directory.name)
    })
    getTable().find('th[aria-colindex="1"]').click().should('have.attr', 'aria-sort', 'descending')
    directoryInstanceMock.forEach((directory, index, arr) => {
      const rowDescendingIndex = arr.length - index - 1

      I.findAllByRole('row')
        .get(`[aria-rowindex=${rowDescendingIndex + 1}]`)
        .should('contain', directory.name)
    })
  })

  it('Should check connection deletion', () => {
    const { id, name: connectionName } = directoryInstanceMock[0]

    I.findByLabelText(id).within(() => {
      getDeleteConnectionButton().click()
    })
    getPresentationWithin(() => {
      I.findByText(deleteConnectionTitle).should('exist').and('be.visible')
      getDialog()
        .should('contain', I.translate('platform/common:directory.deleteConnectionDialog.confirm', { connectionName }))
        .and('contain', deleteDialogDeleteNote)
      I.findByRole('button', { name: I.translate('general/form:commonLabels.cancel') })
        .should('exist')
        .and('be.visible')
      I.findByRole('button', { name: I.translate('general/form:commonLabels.delete') })
        .should('exist')
        .and('be.visible')
        .click()
    })
    I.findByRole('alert').should('contain', I.translate('platform/common:directory.success.deleteConnection')).dismissAlert()
    I.findByLabelText(id).should('not.exist')
  })

  it('Should check connection sync', () => {
    const { id } = directoryInstanceMock[1]

    I.findByLabelText(id).within(() => {
      getSyncButton().click()
    })

    getPresentationWithin(() => {
      I.findByText(syncDialogTitle).should('exist').and('be.visible')
      getDialog().should('contain', syncDialogConfirmText)
      getDialog().find('label').should('contain', I.translate('directory.syncSchedule.type'))
      getDialog().should('contain', syncTypes.USERS_AND_GROUPS)
      I.findAllByRole('button').get('#selectSyncType').click()
    })

    I.findByRole('listbox').within(() => {
      Object.values(syncTypes).forEach(type => {
        I.findByText(type).should('exist').and('be.visible')
      })
      I.findByRole('option', { name: syncTypes.USER_ATTRIBUTES }).click()
    })
    getDialog().should('contain', syncTypes.USER_ATTRIBUTES)

    I.findByRole('button', { name: I.translate('general/form:commonLabels.cancel') })
      .should('exist')
      .and('be.visible')
    I.findByRole('button', { name: I.translate('general/form:commonLabels.submit') })
      .should('exist')
      .and('be.visible')
      .click()
  })
})
