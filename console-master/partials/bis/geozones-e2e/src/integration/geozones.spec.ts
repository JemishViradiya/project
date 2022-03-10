import { apolloQuery } from '@ues-behaviour/shared-e2e'

import { GeozonesPage, GeozonesPageTranslationKey } from '../pages'

describe('bis/geozones', () => {
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')

    I.loadI18nNamespaces(
      'behaviour/geozones-map',
      'behaviour/google-maps',
      'bis/shared',
      'bis/ues',
      'components',
      'formats',
      'general/form',
      'navigation',
      'tables',
    )
  })

  it('Should load the geozones table', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.findGridRows().its('length').should('be.eq', 3)
  })

  it('Should allow selecting multiple geozones', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.selectNthGridRow(0)
    GeozonesPage.selectNthGridRow(1)
  })

  it('Should allow for selecting all rows via the header row checkbox', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.toggleAllRowsSelection()
    GeozonesPage.findSelectedRows().its('length').should('eq', 3)
    GeozonesPage.toggleAllRowsSelection()
    GeozonesPage.findSelectedRows().should('not.exist')
  })

  it('Should render delete button if only one row is selected', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.selectNthGridRow(0)
    GeozonesPage.findGridToolbar().within(() => I.findByRole('button').should('exist'))
  })

  it('Should render delete button if more than one row is selected', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.selectNthGridRow(0)
    GeozonesPage.selectNthGridRow(1)
    GeozonesPage.findGridToolbar().within(() => I.findByRole('button').should('exist'))
  })

  it('Should show deletion modal after clicking on delete button', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.selectNthGridRow(0)
    GeozonesPage.findGridToolbar().within(() => I.findByRole('button').click())
    GeozonesPage.findDeletionModal().should('exist')
  })

  it('Should remove geozone after clicking confirmation button on deletion modal', () => {
    GeozonesPage.waitForPage({
      onBeforeLoad: contentWindow => {
        contentWindow.model.mockAll({
          id: 'bis.deleteGeozones',
          data: apolloQuery({
            queryName: 'deleteGeozones',
            result: {
              deleteGeozones: {
                success: ['af739578-ab38-f948-1cff-dd83957ba7c6'],
                fail: [],
              },
            },
          }),
        })
      },
    })

    GeozonesPage.selectNthGridRow(0)
    GeozonesPage.findGridToolbar().within(() => I.findByRole('button').click())
    GeozonesPage.confirmDeletion()
    GeozonesPage.findSnackbar().should('contain.text', I.translate(GeozonesPageTranslationKey.DeletionConfirmationMessage))
    GeozonesPage.findDeletionModal().should('not.exist')
  })

  it('Should close deletion modal after the cancel button is clicked', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.selectNthGridRow(0)
    GeozonesPage.findGridToolbar().within(() => I.findByRole('button').click())
    GeozonesPage.cancelDeletion()
    GeozonesPage.findDeletionModal().should('not.exist')
  })

  it.skip('Should render map', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.findMap().should('exist')
  })

  it.skip('Should show popup when a geozone row is active', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.clickNthGridRow(0)
    GeozonesPage.findMap().within(() => I.findByRole('dialog').should('exist'))
  })

  it.skip('Should show deletion modal after clicking on delete button on map popup', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.clickNthGridRow(0)
    GeozonesPage.findMap().within(() =>
      I.findByRole('dialog').within(() => {
        I.findByRole('button', { name: I.translate(GeozonesPageTranslationKey.GeozonePopupRemoveButtonName) }).click()
      }),
    )
    GeozonesPage.findDeletionModal().should('exist')
  })

  it.skip('Should hide popup after clicking on cancel button', () => {
    GeozonesPage.waitForPage()

    GeozonesPage.clickNthGridRow(0)
    GeozonesPage.findMap().within(() =>
      I.findByRole('dialog').within(() => {
        I.findByRole('button', { name: I.translate(GeozonesPageTranslationKey.GeozonePopupCancelButtonName) }).click()
      }),
    )
    GeozonesPage.findMap().within(() => I.findByRole('dialog').should('not.exist'))
  })

  it.skip('Should save edited geozone after clicking on save button', () => {
    GeozonesPage.waitForPage({
      onBeforeLoad: contentWindow => {
        contentWindow.model.mockAll({
          id: 'bis.updateGeozone',
          data: apolloQuery({
            queryName: 'updateGeozoneMutation',
            result: { updateGeozone: {} },
          }),
        })
      },
    })

    GeozonesPage.clickNthGridRow(0)
    GeozonesPage.findMap().within(() =>
      I.findByRole('dialog').within(() => {
        I.findByRole('button', { name: I.translate(GeozonesPageTranslationKey.GeozonePopupSaveButtonName) }).click()
      }),
    )

    GeozonesPage.findMap().within(() => I.findByRole('dialog').should('not.exist'))
    GeozonesPage.findSnackbar().should('exist')
  })
})
