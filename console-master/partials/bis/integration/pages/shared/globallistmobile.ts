export const sharedlocators = {
  addNewIpAddressBtn() {
    return I.findByText(I.translate('bis/ues:settings.ipaddresses.addNew'), { timeout: 10000 })
  },
  addBtn() {
    return I.findByRole('button', { name: I.translate('mtd/common:common.add') })
  },
  cancelBtn() {
    return I.findByRole('button', { name: I.translate('mtd/common:common.cancel') })
  },
  deleteIpAddr() {
    return I.findByRole('button', { name: I.translate('mtd/common:common.delete') })
  },
  deleteModalBtn() {
    return I.findByRole('dialog').findByText(I.translate('mtd/common:common.delete'))
  },
  deleteConfirmation() {
    return I.findByRole('dialog', { timeout: 5000 }).findByRole('heading', {
      level: 2,
      name: I.translate('mtd/common:exclusion.deleteConfirmation'),
      timeout: 10000,
    })
  },
  saveBtn() {
    return I.findByRole('button', { name: I.translate('mtd/common:common.save') })
  },
  addConfirmationAlertMsg() {
    return I.findByText(I.translate('mtd/common:exclusion.webAddresses.ipAddressCreateSuccessMsg'), { timeout: 5000 })
  },
  deleteConfirmationAlertMsg() {
    return I.findByText(
      I.translate('mtd/common:exclusion.singleDeleteSuccessMsg', { entity: I.translate('mtd/common:exclusion.entityIp') }),
      { timeout: 20000 },
    )
  },
  editConfirmationAlertMsg() {
    return I.findByText(I.translate('mtd/common:exclusion.webAddresses.ipAddressEditSuccessMsg'), { timeout: 5000 })
  },
}
