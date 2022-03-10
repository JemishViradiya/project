export const IpAddressPageTranslationKey = {
  IPAddressTitle: 'mtd/common:exclusion.restrictedEndpointSourceIpAddress.title',
  IPAddressDescription: 'mtd/common:exclusion.restrictedEndpointSourceIpAddress.description',
  AddButton: 'bis/ues:settings.ipaddresses.addNew',
  DeleteButton: 'bis/ues:settings.ipaddresses.delete',
  DeleteIconButton: 'bis/ues:settings.ipaddresses.deleteItem',
  CloseLabel: 'general/form:commonLabels.close',
  SaveLabel: 'general/form:commonLabels.save',
  CancelLabel: 'general/form:commonLabels.cancel',
}

export const IpAddressPage = {
  waitForPage(url = '#/list') {
    I.visit(url)
    I.findByRole('navigation').should('be.visible')
    this.findTable().should('be.visible')
  },
  findHeading() {
    return I.findByRole('heading', { name: I.translate(IpAddressPageTranslationKey.IPAddressTitle) })
  },
  findDescription() {
    return I.findByText(I.translate(IpAddressPageTranslationKey.IPAddressDescription) as string)
  },
  findTable() {
    return I.findByRole('table')
  },
  findTableToolbar() {
    return I.findByRole('toolbar')
  },
  findDeleteButton() {
    return this.findTableToolbar().findByRole('button', { name: I.translate(IpAddressPageTranslationKey.DeleteButton) })
  },
  findDeleteIconButtons() {
    return this.findTable().findAllByRole('button', { name: I.translate(IpAddressPageTranslationKey.DeleteIconButton) })
  },
  findAddButton() {
    return I.findByRole('toolbar').findByRole('button', { name: I.translate(IpAddressPageTranslationKey.AddButton) })
  },
  findTableHeaderRow() {
    return this.findTable().findAllByRole('row').first()
  },
  findTableRows() {
    return this.findTable()
      .findAllByRole('row')
      .filter(index => index > 0)
  },
  toggleAllRowsSelection() {
    this.findTableHeaderRow().within(() => I.findByRole('checkbox').click())
  },
  findSelectedRows() {
    return this.findTable().findAllByRole('row', { selected: true })
  },
  selectNthTableRow(nth: number) {
    this.findTableRows()
      .filter(index => index === nth)
      .findByRole('checkbox')
      .click()
  },
  findNthTableRow(nth: number) {
    return this.findTableRows().filter(index => index === nth)
  },
  clickNthTableRow(nth: number) {
    this.findTableRows()
      .filter(index => index === nth)
      .click()
  },
  findTableCell(row: number, column) {
    return this.findTableRows()
      .filter(index => index === row)
      .findAllByRole('cell')
      .filter(index => index === column)
  },
  findSnackbar() {
    return I.findByRole('alert')
  },
  findDialog() {
    return I.findByRole('dialog')
  },
}
