export enum GeozonesPageTranslationKey {
  DeletionModalTitle = 'bis/ues:geozones.deleteDialog.singleTitle',
  DeletionModalConfirmationButtonLabel = 'general/form:commonLabels.remove',
  DeletionModalCancellationButtonLabel = 'general/form:commonLabels.cancel',
  DeletionConfirmationMessage = 'bis/ues:geozones.operations.delete.success',
  LocationSearchInputLabel = 'behaviour/geozones-map:operationBar.search.input',
  ToggleMapTypesButton = 'behaviour/google-maps:toggleMapTypes',
  GeozonePopupRemoveButtonName = 'behaviour/geozones-map:popupGeozone.buttonRemoveAriaLabel',
  GeozonePopupCancelButtonName = 'behaviour/geozones-map:popupGeozone.buttonCancel',
  GeozonePopupSaveButtonName = 'behaviour/geozones-map:popupGeozone.buttonSave',
}

export const GeozonesPage = {
  waitForPage(options = {}) {
    I.visit('/', options)
    I.findByRole('navigation').should('be.visible')
    this.findGrid().should('be.visible')
  },
  findGrid() {
    return I.findByRole('grid')
  },
  findGridHeaderRow() {
    return this.findGrid().findAllByRole('row').first()
  },
  toggleAllRowsSelection() {
    this.findGridHeaderRow().within(() => I.findByRole('checkbox').click())
  },
  findGridRows() {
    this.findGrid().findAllByRole('row').should('have.length.at.least', 2)

    return this.findGrid()
      .findAllByRole('row')
      .filter(index => index > 0)
  },
  findSelectedRows() {
    return this.findGrid().findAllByRole('row', { selected: true })
  },
  selectNthGridRow(nth: number) {
    this.findGridRows()
      .filter(index => index === nth)
      .findByRole('checkbox')
      .click()
  },
  clickNthGridRow(nth: number) {
    this.findGridRows()
      .filter(index => index === nth)
      .click()
  },
  findGridToolbar() {
    return I.findByRole('toolbar')
  },
  findDeletionModal() {
    return I.findByLabelText(I.translate(GeozonesPageTranslationKey.DeletionModalTitle))
  },
  confirmDeletion() {
    this.findDeletionModal()
      .findByRole('button', { name: I.translate(GeozonesPageTranslationKey.DeletionModalConfirmationButtonLabel) })
      .click()
  },
  cancelDeletion() {
    this.findDeletionModal()
      .findByRole('button', { name: I.translate(GeozonesPageTranslationKey.DeletionModalCancellationButtonLabel) })
      .click()
  },
  findSnackbar() {
    return I.findByRole('alert')
  },
  findMap() {
    return I.findByRole('application')
  },
  findToggleMapTypesButton() {
    return I.findByRole('button', { name: I.translate(GeozonesPageTranslationKey.ToggleMapTypesButton) }).should('exist')
  },
}
