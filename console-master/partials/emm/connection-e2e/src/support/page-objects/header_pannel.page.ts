export class Header_Panel {
  getHeading(heading: string) {
    return I.findByRole('heading', { name: heading }).should('exist')
  }

  getNavigation() {
    return I.findByRole('navigation')
  }

  getBackButton(text: string) {
    return I.findByRole('button', { name: text }).should('exist')
  }

  getCancelButton() {
    return I.findAllByRole('button', { name: I.translate('button.cancel') })
  }

  getNextButton() {
    return I.findAllByRole('button', { name: I.translate('button.next') })
  }

  getSaveButton() {
    return I.findAllByRole('button', { name: I.translate('button.save') })
  }
}
